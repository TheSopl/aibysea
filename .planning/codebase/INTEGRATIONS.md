# External Integrations

**Analysis Date:** 2026-02-02

## APIs & External Services

**Messaging - WhatsApp:**
- Meta Cloud API - Inbound/outbound WhatsApp messaging
  - SDK/Client: Custom client in `src/lib/whatsapp/client.ts`
  - Types: @whatsapp-cloudapi/types 3.3.0 for type safety
  - Auth: WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID (env vars)
  - Webhook: `src/app/api/webhooks/whatsapp/route.ts`
  - Signature verification: `src/lib/whatsapp/signature.ts` (timing-safe validation)
  - Send endpoint: `src/app/api/whatsapp/send/route.ts`

**Messaging - Telegram:**
- Telegram Bot API - Telegram channel integration
  - SDK/Client: Custom client in `src/lib/telegram/client.ts`
  - Auth: TELEGRAM_BOT_TOKEN (env var)
  - Webhook: `src/app/api/webhooks/telegram/[secret]/route.ts` (secret in URL path)
  - Send endpoint: `src/app/api/telegram/send/route.ts`
  - Constants: `src/lib/telegram/constants.ts`

**AI Orchestration:**
- n8n - Workflow automation and AI agent orchestration
  - Integration method: Webhook callbacks
  - Endpoints:
    - AI response: `src/app/api/webhooks/n8n/ai-response/route.ts`
    - Human takeover: `src/app/api/webhooks/n8n/human-takeover/route.ts`
  - Auth: Shared secret or signature validation (implementation TBD)
  - Use case: Decoupled AI logic from application code

**Voice Services (Mock Data):**
- Planned integrations: ElevenLabs, PlayHT, Twilio, Bland.ai
  - Current status: Mock API endpoints only (`src/app/api/voice/`)
  - Real integration deferred to v5.0

**Document Processing (Mock Data):**
- Planned: GPT-4 Vision, OCR providers
  - Current status: Mock API endpoints only (`src/app/api/documents/`)
  - Real integration deferred to v5.0

## Data Storage

**Databases:**
- Supabase PostgreSQL - Primary data store
  - Connection: via DATABASE_URL and Supabase client config
  - Client: @supabase/supabase-js 2.90.1
  - SSR handling: @supabase/ssr 0.8.0 for cookie-based sessions
  - Locations:
    - `src/lib/supabase/client.ts` - Client-side operations
    - `src/lib/supabase/server.ts` - Server-side operations
    - `src/lib/supabase/admin.ts` - Admin operations (RLS bypass)
    - `src/lib/supabase/middleware.ts` - Auth middleware
  - Real-time: Supabase real-time subscriptions (REPLICA IDENTITY FULL required on messages table)

**File Storage:**
- Not detected in current codebase (likely Supabase Storage if needed)

**Caching:**
- None detected (no Redis, no edge caching layer)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Email/password + social auth
  - Implementation: Supabase SSR package with cookie-based sessions
  - Token storage: httpOnly cookies via @supabase/ssr
  - Session management: Middleware in `src/lib/supabase/middleware.ts`
  - Signup endpoint: `src/app/api/auth/signup/route.ts`
  - RLS: Simple model - all authenticated users see all data (from PROJECT.md)

**OAuth Integrations:**
- Not detected in current codebase (can be added via Supabase dashboard)

## Monitoring & Observability

**Error Tracking:**
- None detected (**CRITICAL GAP** - no Sentry, no error monitoring)

**Analytics:**
- None detected (no Mixpanel, GA4, or product analytics)

**Logs:**
- stdout/stderr only (Next.js console logging)
  - Vercel deployment would capture these automatically

## CI/CD & Deployment

**Hosting:**
- Vercel (inferred from Next.js stack and project context)
  - Deployment: Likely automatic on git push to main
  - Environment vars: Configured in Vercel dashboard
  - Edge functions: Via Next.js middleware

**CI Pipeline:**
- Not detected (no .github/workflows/, no CI config files)
  - **GAP**: No automated testing or type checking in CI

## Environment Configuration

**Development:**
- Required env vars (inferred from code):
  - Database: DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
  - WhatsApp: WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_WEBHOOK_VERIFY_TOKEN
  - Telegram: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET
  - n8n: N8N_WEBHOOK_SECRET (inferred)
- Secrets location: .env.local (gitignored, no .env.example template **CONCERN**)

**Staging:**
- Not explicitly configured (likely same pattern as dev with different Supabase project)

**Production:**
- Secrets management: Vercel environment variables
- Database: Supabase production project

## Webhooks & Callbacks

**Incoming:**
- WhatsApp - `/api/webhooks/whatsapp`
  - Verification: Meta signature validation via `src/lib/whatsapp/signature.ts` (crypto.timingSafeEqual)
  - Events: message received, status updates
  - Deduplication: whatsapp_message_id column (prevents webhook retry duplicates)

- Telegram - `/api/webhooks/telegram/[secret]`
  - Verification: Secret in URL path
  - Events: message received, bot commands

- n8n AI Response - `/api/webhooks/n8n/ai-response`
  - Purpose: Receive AI-generated responses from n8n workflows
  - Security: TBD (needs signature verification)

- n8n Human Takeover - `/api/webhooks/n8n/human-takeover`
  - Purpose: Notify when human agent takes over conversation
  - Security: TBD

**Outgoing:**
- WhatsApp Send - `POST /api/whatsapp/send`
  - Triggers: User sends message, AI response sent
  - Endpoint: Meta Cloud API

- Telegram Send - `POST /api/telegram/send`
  - Triggers: User sends message, AI response sent
  - Endpoint: Telegram Bot API

---

*Integration audit: 2026-02-02*
*Update when adding/removing external services*
