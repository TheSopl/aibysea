# Phase 25: Enterprise Security & Architecture — Context

**Goal:** Implement multi-tenant RLS policies, unify webhook security (HMAC for all), add rate limiting, create .env.example, audit service role usage.

**Source:** [codebase/CONCERNS.md](../../codebase/CONCERNS.md) — Architecture, Security, RLS sections (lines 186-332)

---

## 🔒 Critical Issues to Fix

### 1. RLS Policy Simplicity Risk (No Multi-Tenancy)
**Current State:**
- RLS model: "All authenticated agents see all data"
- Designed for internal tool, no data isolation
- Cannot scale to multi-tenant SaaS

**From CONCERNS.md:**
```
### RLS Policy Simplicity Risk
- Issue: "All authenticated agents see all data" RLS model (from PROJECT.md)
- Why: Designed for internal tool, no multi-tenancy needed initially
- Impact: Cannot scale to multi-tenant SaaS without RLS refactor
- Blocks: External customer usage (data isolation required)
- Fix approach:
  - Add organization_id column to all tables
  - Implement organization-based RLS policies
  - Add user-organization membership table
  - Migrate to proper multi-tenant architecture
```

**Current RLS pattern (example):**
```sql
-- CURRENT: All users see everything
CREATE POLICY "Allow all for authenticated users"
ON messages FOR ALL
TO authenticated
USING (true); -- ❌ No isolation
```

**Required pattern:**
```sql
-- NEW: Organization-based isolation
CREATE POLICY "Users see only their organization's data"
ON messages FOR ALL
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM user_organizations
    WHERE user_id = auth.uid()
  )
);
```

---

### 2. Webhook Security Incomplete
**Current State:**
- WhatsApp: HMAC signature validation ✅ (good)
- Telegram: Secret in URL ⚠️ (less secure)
- n8n: No validation ❌ (vulnerable)

**From CONCERNS.md:**
```
### Webhook Security Incomplete
- Issue: WhatsApp has signature validation, but Telegram uses secret in URL, n8n validation TBD
- Files:
  - src/lib/whatsapp/signature.ts - GOOD (timing-safe validation)
  - src/app/api/webhooks/telegram/[secret]/route.ts - Secret in URL (less secure)
  - src/app/api/webhooks/n8n/* - Validation TBD
- Impact: Telegram/n8n webhooks vulnerable to unauthorized access
- Fix approach:
  - Implement signature validation for all webhooks
  - Use HMAC signatures for n8n webhooks
  - Move Telegram to header-based auth (not URL secret)
  - Unified webhook validation middleware
```

**WhatsApp (current - good):**
```typescript
// src/lib/whatsapp/signature.ts
import crypto from 'crypto'

export function validateSignature(
  signature: string,
  body: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
```

**n8n (needs implementation):**
- Add HMAC secret to n8n webhook configuration
- Validate X-N8N-Signature header
- Reject requests with invalid signatures

---

### 3. No Rate Limiting on API Routes
**Current State:**
- No rate limiting implemented
- Vulnerable to abuse and DDoS
- All public endpoints unprotected

**From CONCERNS.md:**
```
### No Rate Limiting on API Routes
- Issue: No rate limiting detected on public API routes
- Files: All src/app/api/**/*.ts routes
- Impact: Vulnerable to abuse, DDoS attacks
- Fix approach:
  - Implement rate limiting middleware (Upstash Rate Limit, Vercel KV)
  - Apply to all public endpoints (webhooks, API routes)
  - Different limits per endpoint (stricter for expensive operations)
```

**Rate limiting strategy:**
- Webhooks: 100 req/min per IP
- API routes: 60 req/min per user
- Auth endpoints: 5 req/min per IP (brute force protection)
- Document processing: 10 req/min per user (expensive)

**Recommended tool:**
- Upstash Rate Limit (serverless-friendly, Redis-based)
- Or Vercel KV (if on Vercel)

---

### 4. No .env.example File
**Current State:**
- No environment variable template
- New developers don't know required variables
- Undocumented configuration

**From CONCERNS.md:**
```
### No .env.example File
- Issue: No environment variable template for developers
- Impact: New developers don't know which env vars are required
- Fix approach:
  - Create .env.example with all required keys (no values)
  - Document each variable in comments
  - Add to onboarding documentation
```

**Required environment variables:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# WhatsApp
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_APP_SECRET=

# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_SECRET=

# n8n
N8N_WEBHOOK_BASE_URL=
N8N_WEBHOOK_SECRET=

# Twilio (Phase 23)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# OpenAI (Phase 23)
OPENAI_API_KEY=

# Sentry (Phase 20)
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

---

### 5. Service Role Key Exposure Risk
**Current State:**
- Admin client uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)
- Used in webhook processing (necessary)
- Usage not audited

**From CONCERNS.md:**
```
### Service Role Key Exposure Risk
- Issue: Admin client uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)
- Files: src/lib/supabase/admin.ts
- Impact: If leaked, full database access
- Mitigation: Only used server-side (not exposed to client), but review all usages
- Recommendations:
  - Audit all admin client usage
  - Minimize service role usage (use user context where possible)
  - Rotate service role key if ever committed to git
```

**Audit required:**
- Find all `createAdminClient()` usage
- Verify necessary (RLS bypass needed)
- Replace with user context where possible
- Document why service role is needed

---

## 🏗️ Multi-Tenant Architecture Design

### Database Schema Changes
**Add organization tables:**
```sql
-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free', -- 'free', 'pro', 'enterprise'
  status TEXT DEFAULT 'active', -- 'active', 'suspended', 'deleted'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-organization membership
CREATE TABLE user_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'owner', 'admin', 'member'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- Add organization_id to ALL existing tables
ALTER TABLE conversations ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE messages ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE ai_agents ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE voice_agents ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE documents ADD COLUMN organization_id UUID REFERENCES organizations(id);
-- ... etc for all tables
```

### RLS Policy Template
**Apply to all tables:**
```sql
-- Read policy
CREATE POLICY "org_members_read_{table_name}"
ON {table_name} FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM user_organizations
    WHERE user_id = auth.uid()
  )
);

-- Insert policy
CREATE POLICY "org_members_insert_{table_name}"
ON {table_name} FOR INSERT
TO authenticated
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM user_organizations
    WHERE user_id = auth.uid()
  )
);

-- Update policy
CREATE POLICY "org_members_update_{table_name}"
ON {table_name} FOR UPDATE
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM user_organizations
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM user_organizations
    WHERE user_id = auth.uid()
  )
);

-- Delete policy (admin/owner only)
CREATE POLICY "org_admins_delete_{table_name}"
ON {table_name} FOR DELETE
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM user_organizations
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
  )
);
```

### Data Migration Strategy
**Backfill existing data:**
1. Create default organization for current users
2. Backfill organization_id on all existing records
3. Enable RLS policies
4. Test with multiple organizations

```sql
-- Migration script
-- 1. Create default org
INSERT INTO organizations (id, name, slug)
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Organization', 'default');

-- 2. Add all current users to default org
INSERT INTO user_organizations (user_id, organization_id, role)
SELECT id, '00000000-0000-0000-0000-000000000001', 'owner'
FROM auth.users;

-- 3. Backfill organization_id
UPDATE conversations SET organization_id = '00000000-0000-0000-0000-000000000001';
UPDATE messages SET organization_id = '00000000-0000-0000-0000-000000000001';
UPDATE ai_agents SET organization_id = '00000000-0000-0000-0000-000000000001';
-- ... etc

-- 4. Make organization_id NOT NULL (after backfill)
ALTER TABLE conversations ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE messages ALTER COLUMN organization_id SET NOT NULL;
-- ... etc
```

---

## 📁 Files to Create/Modify

### Multi-Tenancy
```
supabase/migrations/00X_add_organizations.sql        # Organizations + user_organizations tables
supabase/migrations/00Y_add_org_id_columns.sql       # Add organization_id to all tables
supabase/migrations/00Z_organization_rls.sql         # RLS policies for all tables
src/lib/supabase/organizations.ts                    # Organization helpers
src/hooks/useCurrentOrganization.ts                  # React hook for org context
```

### Webhook Security
```
src/lib/webhooks/signature-validator.ts              # Unified HMAC validator
src/app/api/webhooks/telegram/route.ts               # REPLACE: Header-based auth
src/app/api/webhooks/n8n/route.ts                    # ADD: Signature validation
src/middleware/validateWebhook.ts                    # NEW: Webhook middleware
```

### Rate Limiting
```
src/lib/rate-limit.ts                                # Rate limiter setup (Upstash)
src/middleware/rateLimit.ts                          # Rate limit middleware
src/app/api/*/route.ts                               # ADD: Rate limiting to all routes
```

### Environment
```
.env.example                                         # NEW: Template with all variables
docs/ENVIRONMENT.md                                  # NEW: Env var documentation
```

### Security Audit
```
docs/SECURITY.md                                     # NEW: Security practices
src/lib/supabase/admin-usage-audit.md               # Document service role usage
```

---

## 🔧 Technical Approach

### Rate Limiting Implementation
```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create rate limiters
export const apiRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 req/min
  analytics: true
})

export const webhookRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 req/min
  analytics: true
})

export const authRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 req/min
  analytics: true
})

// Usage in API route
export async function POST(req: Request) {
  const identifier = getIdentifier(req) // IP or user ID
  const { success } = await apiRateLimit.limit(identifier)

  if (!success) {
    return new Response('Too Many Requests', { status: 429 })
  }

  // ... continue with handler
}
```

### Unified Webhook Validation
```typescript
// src/lib/webhooks/signature-validator.ts
import crypto from 'crypto'

export function validateWebhookSignature(
  signature: string,
  body: string,
  secret: string,
  algorithm: 'sha256' | 'sha1' = 'sha256'
): boolean {
  const expectedSignature = crypto
    .createHmac(algorithm, secret)
    .update(body)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

// Middleware
export function withWebhookValidation(
  handler: (req: Request) => Promise<Response>,
  options: { secret: string; headerName: string }
) {
  return async (req: Request) => {
    const signature = req.headers.get(options.headerName)
    const body = await req.text()

    if (!signature || !validateWebhookSignature(signature, body, options.secret)) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Re-create request with parsed body
    const newReq = new Request(req, { body })
    return handler(newReq)
  }
}
```

---

## 🎯 Success Criteria

Phase 25 is complete when:

- [ ] **Multi-Tenancy:**
  - [ ] Organizations table created
  - [ ] User-organization membership table created
  - [ ] organization_id added to all tables
  - [ ] RLS policies implemented for all tables
  - [ ] Data migration script tested
  - [ ] Multi-org tested with 3+ orgs

- [ ] **Webhook Security:**
  - [ ] Unified HMAC validator created
  - [ ] Telegram webhook uses header-based auth
  - [ ] n8n webhook has signature validation
  - [ ] All webhooks reject invalid signatures
  - [ ] Webhook security documented

- [ ] **Rate Limiting:**
  - [ ] Upstash/Vercel KV configured
  - [ ] Rate limiting applied to all API routes
  - [ ] Different limits per endpoint type
  - [ ] 429 responses tested
  - [ ] Rate limit monitoring dashboard

- [ ] **Environment:**
  - [ ] .env.example created
  - [ ] All variables documented
  - [ ] ENVIRONMENT.md guide written
  - [ ] Onboarding docs updated

- [ ] **Service Role Audit:**
  - [ ] All admin client usage documented
  - [ ] Unnecessary usage replaced
  - [ ] Audit log created
  - [ ] Security best practices documented

---

## 📚 Related Documentation

**Codebase analysis:**
- [codebase/CONCERNS.md](../../codebase/CONCERNS.md) — Architecture + Security sections
- [codebase/ARCHITECTURE.md](../../codebase/ARCHITECTURE.md) — Current RLS model

**External resources:**
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
- Supabase Multi-tenancy: https://supabase.com/docs/guides/auth/multi-tenancy
- Upstash Rate Limit: https://upstash.com/docs/oss/sdks/ts/ratelimit/overview
- Vercel KV: https://vercel.com/docs/storage/vercel-kv

**Prior decisions (STATE.md):**
- Simple RLS model (all authenticated see all) — designed for internal tool
- WhatsApp HMAC validation using crypto.timingSafeEqual (Phase 13.1)

---

## 🚧 Blockers & Dependencies

**Depends on:**
- Phase 20 complete (migrations system needed)
- Phase 23 complete (webhook endpoints exist for security hardening)

**Blocks:**
- External customer onboarding (blocked without multi-tenancy)
- Production deployment (blocked without rate limiting)

**Risks:**
- Multi-tenant migration is complex (data backfill, RLS testing)
- RLS bugs can leak data between orgs (test thoroughly)
- Rate limiting may block legitimate traffic (tune limits)
- Service role usage audit may find necessary usages

**Mitigation:**
- Test multi-tenancy with multiple test organizations
- Write comprehensive RLS tests
- Monitor rate limiting in production
- Document all service role usage with justification

---

## 💡 Planning Notes

**Suggested plan breakdown:**
1. **25-01:** Multi-Tenant Architecture (organizations tables, RLS policies, migration)
2. **25-02:** Webhook Security Hardening (unified validator, Telegram/n8n fixes)
3. **25-03:** Rate Limiting & Environment (Upstash setup, .env.example, audit)

**Or combine into 2 plans:**
1. **25-01:** Multi-Tenancy (complete org architecture + RLS + migration + testing)
2. **25-02:** Security Hardening (webhooks + rate limiting + env + audit)

**Estimated complexity:** High (multi-tenancy is complex, RLS testing critical)

**Research required:**
- Supabase multi-tenancy best practices
- Organization-based RLS patterns (edge cases)
- Upstash vs Vercel KV comparison (pricing, DX, features)
- Data migration strategies (zero-downtime if possible)

**Testing strategy:**
- Unit tests for RLS policies (test data isolation)
- Integration tests with multiple orgs
- Load testing for rate limiting
- Security testing for webhooks (invalid signatures)

---

*Context prepared: 2026-02-02*
*Ready for: /gsd:plan-phase 25 (or /gsd:research-phase 25 first)*
