# Phase 2: WhatsApp Integration - Research

**Researched:** 2026-01-10
**Domain:** WhatsApp Cloud API integration for message receiving/sending
**Confidence:** HIGH

<research_summary>
## Summary

Researched the WhatsApp Cloud API ecosystem for building a webhook-based messaging integration with Next.js. The Cloud API is Meta's hosted solution that handles scaling automatically - we register webhooks to receive incoming messages and call REST endpoints to send outbound messages.

Key findings: The official WhatsApp Node.js SDK was **archived in June 2023** - don't use it. Instead, use direct API calls with `fetch` or the community-maintained `whatsapp-business` SDK which has TypeScript support. For type safety, the `@whatsapp-cloudapi/types` package provides comprehensive webhook and message types.

Critical constraints: The 24-hour messaging window requires template messages for business-initiated conversations. Rate limits are 80 messages/second default (upgradable to 1,000), with pair rate limits of ~10 messages/minute to the same recipient.

**Primary recommendation:** Build webhook handlers as Next.js Route Handlers (App Router), use `@whatsapp-cloudapi/types` for TypeScript types, implement signature verification for security, and store messages with conversation state tracking for the 24-hour window.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@whatsapp-cloudapi/types` | latest | TypeScript types for webhooks & messages | Zero runtime overhead, comprehensive types for all payload structures |
| native `fetch` | (built-in) | HTTP client for Cloud API calls | No dependencies needed, works in Next.js edge/serverless |
| `crypto` | (Node.js built-in) | HMAC-SHA256 signature verification | Required for webhook security |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `whatsapp-business` | 1.x | Full SDK with TypeScript | If you want higher-level abstractions over raw API calls |
| `@whatsapp-cloudapi/emulator` | latest | Mock server for testing | Development/testing without hitting real API |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@whatsapp-cloudapi/types` | `whatsapp-business` SDK | SDK adds runtime code; types-only is lighter |
| native `fetch` | `axios` | Axios adds bundle size; fetch is sufficient |
| `whatsapp` (official SDK) | Any alternative | **ARCHIVED** - do not use, unmaintained since June 2023 |

**Installation:**
```bash
npm install @whatsapp-cloudapi/types
# Optional: full SDK if needed
npm install whatsapp-business
```

**Environment Variables Required:**
```env
WHATSAPP_PHONE_NUMBER_ID=     # Your business phone number ID
WHATSAPP_ACCESS_TOKEN=        # Permanent system user access token
WHATSAPP_WEBHOOK_VERIFY_TOKEN= # Custom string for webhook verification
WHATSAPP_APP_SECRET=          # For signature verification (X-Hub-Signature-256)
WHATSAPP_API_VERSION=v21.0    # Current Graph API version (check for updates)
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── api/
│       └── webhooks/
│           └── whatsapp/
│               └── route.ts    # Webhook handler (GET for verify, POST for messages)
├── lib/
│   └── whatsapp/
│       ├── client.ts           # WhatsApp API client (send messages)
│       ├── signature.ts        # Signature verification
│       ├── types.ts            # Re-export types, custom types
│       └── constants.ts        # API URLs, version
└── services/
    └── messages/
        └── processor.ts        # Message processing logic
```

### Pattern 1: Webhook Handler with Signature Verification
**What:** Single Route Handler that handles both webhook verification (GET) and message receiving (POST)
**When to use:** Always - this is the standard pattern
**Example:**
```typescript
// src/app/api/webhooks/whatsapp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type { WebhookPayload } from '@whatsapp-cloudapi/types/webhook';
import { verifySignature } from '@/lib/whatsapp/signature';

// GET: Webhook verification (called once when subscribing)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

// POST: Receive incoming messages
export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-hub-signature-256');
  const body = await request.text();

  // CRITICAL: Verify signature in production
  if (!verifySignature(body, signature)) {
    return new NextResponse('Invalid signature', { status: 401 });
  }

  const payload: WebhookPayload = JSON.parse(body);

  // Process asynchronously, respond quickly (within 5 seconds)
  // WhatsApp retries if no 200 within 5s
  processWebhookAsync(payload);

  return new NextResponse('OK', { status: 200 });
}
```

### Pattern 2: Signature Verification
**What:** HMAC-SHA256 verification of webhook payloads using app secret
**When to use:** Always in production - prevents spoofed webhooks
**Example:**
```typescript
// src/lib/whatsapp/signature.ts
import { createHmac, timingSafeEqual } from 'crypto';

export function verifySignature(
  payload: string,
  signature: string | null
): boolean {
  if (!signature) return false;

  const expectedSignature = 'sha256=' + createHmac('sha256', process.env.WHATSAPP_APP_SECRET!)
    .update(payload)
    .digest('hex');

  // Timing-safe comparison to prevent timing attacks
  try {
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}
```

### Pattern 3: Send Message Client
**What:** Thin wrapper around Cloud API for sending messages
**When to use:** All outbound messages
**Example:**
```typescript
// src/lib/whatsapp/client.ts
const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v21.0';
const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

const BASE_URL = `https://graph.facebook.com/${API_VERSION}/${PHONE_ID}/messages`;

export async function sendTextMessage(to: string, text: string) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to, // Phone number without + prefix
      type: 'text',
      text: { body: text },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`WhatsApp API error: ${error.error?.message}`);
  }

  return response.json();
}

export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string,
  components?: any[]
) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`WhatsApp API error: ${error.error?.message}`);
  }

  return response.json();
}
```

### Anti-Patterns to Avoid
- **Blocking webhook response:** Process messages async; respond 200 within 5 seconds or WhatsApp retries
- **Skipping signature verification:** Never skip in production; prevents webhook spoofing attacks
- **Using the archived official SDK:** `whatsapp` npm package is unmaintained since June 2023
- **Hardcoding phone numbers with +:** WhatsApp internally strips `+`; store without prefix
- **Not tracking 24-hour window:** Send template messages if window closed; free-form fails with error 131047
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Webhook types | Custom interfaces | `@whatsapp-cloudapi/types` | Comprehensive, maintained, covers edge cases |
| Signature verification | Skip or basic string compare | `crypto.timingSafeEqual` | Prevents timing attacks |
| Message deduplication | None | Check `message_id` in database | WhatsApp may retry; process once |
| Retry logic | None | Queue + exponential backoff | Rate limits (80 mps) require pacing |
| Phone number formatting | String manipulation | Store normalized (no +) | WhatsApp strips `+`; keep consistent |
| 24-hour window tracking | Guess/hope | Track `last_customer_message_at` | Error 131047 if you send outside window |

**Key insight:** The WhatsApp Cloud API has strict rules (24-hour window, rate limits, signature verification) that aren't optional. The ecosystem provides types and patterns - use them rather than discovering edge cases the hard way.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Slow Webhook Response → Duplicate Messages
**What goes wrong:** WhatsApp retries webhook if no 200 response within ~5 seconds; you process same message multiple times
**Why it happens:** Synchronous database operations in webhook handler
**How to avoid:** Return 200 immediately, process asynchronously. Implement idempotency check using `message_id`.
**Warning signs:** Duplicate messages in database, user complaints about repeated messages

### Pitfall 2: Error 131047 - Re-engagement Message
**What goes wrong:** API rejects free-form message with "More than 24 hours since recipient last replied"
**Why it happens:** Customer service window expired, but code tried to send regular message
**How to avoid:** Track `last_customer_message_at` per conversation. If >24h, use template message instead.
**Warning signs:** API errors when replying to older conversations

### Pitfall 3: Error 131056 - Pair Rate Limit
**What goes wrong:** Too many messages to same recipient rejected
**Why it happens:** Sending >10 messages/minute to same user (bots can trigger this easily)
**How to avoid:** Implement per-recipient rate limiting. Batch related content into fewer messages.
**Warning signs:** 429 errors when messaging specific users repeatedly

### Pitfall 4: Missing Signature Verification
**What goes wrong:** Attackers can spoof webhook payloads, inject fake messages
**Why it happens:** Skipped during development, never added for production
**How to avoid:** Always verify `X-Hub-Signature-256` header using app secret
**Warning signs:** None until you're attacked - implement proactively

### Pitfall 5: Template Message Rejection
**What goes wrong:** Template calls fail with 132001 "Template does not exist"
**Why it happens:** Wrong template name, wrong language code, template not approved yet
**How to avoid:** Use exact template name and language from WhatsApp Manager. Wait for approval (up to 48h).
**Warning signs:** API errors when sending templates; check template status in Meta Business Suite

### Pitfall 6: Phone Number Format Inconsistency
**What goes wrong:** Database has mixed formats (+1234, 1234); lookups fail
**Why it happens:** Incoming webhooks use `wa_id` (no +), but you stored with +
**How to avoid:** Normalize all phone numbers to WhatsApp format (no + prefix) on storage
**Warning signs:** "Contact not found" errors, duplicate contacts in database
</common_pitfalls>

<code_examples>
## Code Examples

### Webhook Payload Structure (Incoming Text Message)
```typescript
// Source: @whatsapp-cloudapi/types + Meta documentation
// This is what your webhook receives for a text message
{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "BUSINESS_ACCOUNT_ID",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": {
          "display_phone_number": "15550001234",
          "phone_number_id": "PHONE_NUMBER_ID"
        },
        "contacts": [{
          "profile": { "name": "Customer Name" },
          "wa_id": "15551234567"  // No + prefix
        }],
        "messages": [{
          "from": "15551234567",
          "id": "wamid.ABC123...",  // Unique message ID for deduplication
          "timestamp": "1234567890",
          "text": { "body": "Hello!" },
          "type": "text"
        }]
      },
      "field": "messages"
    }]
  }]
}
```

### Webhook Payload Structure (Message Status Update)
```typescript
// Source: Meta documentation
// Delivery/read receipts come as status webhooks
{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "BUSINESS_ACCOUNT_ID",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": {
          "display_phone_number": "15550001234",
          "phone_number_id": "PHONE_NUMBER_ID"
        },
        "statuses": [{
          "id": "wamid.ABC123...",
          "status": "delivered",  // sent | delivered | read | failed
          "timestamp": "1234567890",
          "recipient_id": "15551234567"
        }]
      },
      "field": "messages"
    }]
  }]
}
```

### Processing Different Message Types
```typescript
// Source: Pattern from @whatsapp-cloudapi/types
import type { WebhookPayload } from '@whatsapp-cloudapi/types/webhook';

function processMessage(payload: WebhookPayload) {
  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      if (change.field !== 'messages') continue;

      const { messages, contacts, statuses } = change.value;

      // Handle incoming messages
      if (messages) {
        for (const message of messages) {
          const contact = contacts?.find(c => c.wa_id === message.from);

          switch (message.type) {
            case 'text':
              handleTextMessage(message.from, message.text.body, contact);
              break;
            case 'image':
              handleImageMessage(message.from, message.image, contact);
              break;
            case 'interactive':
              // Button replies, list selections
              handleInteractiveMessage(message.from, message.interactive, contact);
              break;
            // ... other types: audio, video, document, location, etc.
          }
        }
      }

      // Handle status updates (delivery receipts)
      if (statuses) {
        for (const status of statuses) {
          updateMessageStatus(status.id, status.status, status.timestamp);
        }
      }
    }
  }
}
```

### Downloading Media from Incoming Message
```typescript
// Source: Meta Cloud API documentation
// Media messages contain an ID; you must fetch the URL then download
async function downloadMedia(mediaId: string): Promise<Buffer> {
  const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v21.0';
  const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

  // Step 1: Get media URL (valid for 5 minutes)
  const mediaResponse = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${mediaId}`,
    {
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` },
    }
  );
  const { url } = await mediaResponse.json();

  // Step 2: Download the actual media
  const downloadResponse = await fetch(url, {
    headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` },
  });

  return Buffer.from(await downloadResponse.arrayBuffer());
}
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Official `whatsapp` SDK | Direct API + types package | June 2023 | SDK archived; use `@whatsapp-cloudapi/types` or `whatsapp-business` |
| Per-phone-number limits | Portfolio-level limits | October 2025 | All numbers share messaging limit; simplifies capacity planning |
| Conversation-based pricing | Hybrid per-message pricing | July 2025 | Template messages billed per-message; utility free in 24h window |
| API version v16.0 | v21.0+ | 2025 | Check current version; older versions deprecated on rolling basis |

**New tools/patterns to consider:**
- **@whatsapp-cloudapi/emulator:** Mock server for development/testing without real API
- **Utility templates free in window:** Since July 2025, utility templates sent within 24h window are free

**Deprecated/outdated:**
- **Official WhatsApp Node.js SDK:** Archived June 2023, do not use
- **On-Premises API:** Being phased out; Cloud API is the standard
- **Graph API versions <v18.0:** Check deprecation schedule; keep API version current
</sota_updates>

<open_questions>
## Open Questions

Things that couldn't be fully resolved:

1. **Exact current Graph API version**
   - What we know: v21.0 referenced in 2025 articles; versions deprecate on rolling schedule
   - What's unclear: Exact current stable version (Meta docs not fetchable)
   - Recommendation: Check Meta Developer Dashboard for current version; use environment variable for easy updates

2. **Optimal message queue implementation**
   - What we know: Need async processing for webhooks; rate limits require pacing
   - What's unclear: Best queue solution for Supabase/Next.js stack (Supabase edge functions, external queue, etc.)
   - Recommendation: Start with simple async processing; add queue if rate limits become issue

3. **Media storage strategy**
   - What we know: Media URLs valid only 5 minutes; media persists 30 days on WhatsApp servers
   - What's unclear: Whether to download/store all media or fetch on-demand
   - Recommendation: Download and store in Supabase Storage for reliable access; decide based on storage costs
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [WhatsApp Business SDK (whatsapp-business)](https://github.com/MarcosNicolau/whatsapp-business-sdk) - Active, TypeScript, maintained
- [@whatsapp-cloudapi/types](https://www.npmjs.com/search?q=keywords:whatsapp-cloud-api) - TypeScript types package
- [Meta WhatsApp Business Blog](https://business.whatsapp.com/blog/how-to-use-webhooks-from-whatsapp-business-api) - Official webhook guide
- [Heltar Error Codes Guide](https://www.heltar.com/blogs/all-meta-error-codes-explained-along-with-complete-troubleshooting-guide-2025-cm69x5e0k000710xtwup66500) - Comprehensive error reference

### Secondary (MEDIUM confidence)
- [Fyno Rate Limits Guide](https://www.fyno.io/blog/whatsapp-rate-limits-for-developers-a-guide-to-smooth-sailing-clycvmek2006zuj1oof8uiktv) - Rate limits and throughput, cross-verified with multiple sources
- [SMSGatewayCenter Media Guide](https://www.smsgatewaycenter.com/blog/whatsapp-business-api-media-management-images-videos-documents/) - Media handling patterns
- [Next.js API Routes Documentation](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) - Webhook handler patterns
- [ChatArchitect 24-Hour Window](https://botsailor.com/help/en/blog/whatsapp-requirements-limitations-you-should-know-24h-rule-template-messaging) - Messaging window rules

### Tertiary (LOW confidence - needs validation)
- Graph API version numbers - verify against Meta Developer Dashboard
- Pricing details - verify in Meta Business Suite for your specific account
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: WhatsApp Cloud API (Meta Graph API)
- Ecosystem: Types packages, community SDKs, Next.js integration
- Patterns: Webhook handlers, signature verification, message sending
- Pitfalls: Rate limits, 24-hour window, error handling

**Confidence breakdown:**
- Standard stack: HIGH - verified multiple npm packages, cross-referenced
- Architecture: HIGH - patterns from official blog and community examples
- Pitfalls: HIGH - documented error codes with troubleshooting steps
- Code examples: HIGH - based on official API structure and types

**Research date:** 2026-01-10
**Valid until:** 2026-02-10 (30 days - Cloud API relatively stable)
</metadata>

---

*Phase: 02-whatsapp-integration*
*Research completed: 2026-01-10*
*Ready for planning: yes*
