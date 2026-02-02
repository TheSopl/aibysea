# Phase 20: Foundation & Quality Infrastructure — Context

**Goal:** Establish testing framework, error monitoring, CI/CD pipeline, and database migration system for enterprise-grade development practices.

**Source:** [codebase/CONCERNS.md](../../codebase/CONCERNS.md) — Missing Critical Features + Testing sections

---

## 🚨 Critical Issues to Fix

### 1. Zero Test Coverage
**Current State:**
- 0 tests across entire 121-file codebase
- No test framework configured
- No testing tools installed

**From TESTING.md:**
```
🚨 ZERO TESTS across entire codebase
- No test framework configured (no vitest.config.ts, jest.config.js, playwright.config.ts)
- No test files found (no *.test.ts, *.spec.ts, *.test.tsx)
- Critical areas needing tests:
  - Webhook signature validation (security-critical)
  - i18n/RTL rendering
  - API route handlers
  - Real-time subscriptions
```

**Why Critical:**
- Cannot refactor safely without tests
- Regressions go undetected
- Architecture changes (Phase 21-25) require test coverage

**Recommended Stack:**
- Vitest (unit/integration tests) — Fast, Next.js 16 compatible
- Testing Library (component tests) — React best practices
- Playwright (E2E tests) — Cross-browser, mobile testing

---

### 2. No Error Monitoring
**Current State:**
- Zero error tracking in production
- No observability infrastructure
- Production errors invisible until users report

**From CONCERNS.md:**
```
### No Error Monitoring / Observability
- Issue: Zero error tracking, no monitoring infrastructure
- Impact: Production errors are invisible until users report
- Blocks: Cannot diagnose production issues, no error metrics
- Implementation complexity: Low (Sentry integration ~30 min)
- Priority: CRITICAL
```

**What's Missing:**
- Sentry (or similar) integration
- Error boundaries in UI
- Source map upload for stack traces
- Alert configuration for critical errors

**Why Critical:**
- Currently flying blind in production
- Cannot diagnose user-reported issues
- No visibility into error frequency/severity

---

### 3. No CI/CD Pipeline
**Current State:**
- No automated testing
- No linting in CI
- No type checking in CI
- No build verification before merge

**From CONCERNS.md:**
```
### No CI/CD Pipeline
- Issue: No automated testing, linting, or type checking in CI
- Impact: Bad code can be deployed, no safety net
- Blocks: Team collaboration, safe deployments
- Implementation complexity: Low (GitHub Actions ~1 hour)
- Priority: HIGH
```

**What to Build:**
- GitHub Actions workflow (`.github/workflows/ci.yml`)
- Jobs: lint → typecheck → test → build
- Run on all PRs and pushes to main
- Block merge if any job fails

---

### 4. No Database Migration System
**Current State:**
- Schema changes made manually in Supabase dashboard
- No version control for database schema
- Cannot sync dev/staging/prod schemas

**From CONCERNS.md:**
```
### No Database Migration System
- Issue: No migration files detected
- Why: Using Supabase dashboard for schema changes (manual)
- Impact: Cannot version control schema, hard to sync dev/staging/prod
- Fix approach:
  - Use Supabase CLI migrations: `supabase migration new <name>`
  - Commit migrations to git
  - Apply migrations in CI/CD pipeline
```

**What to Setup:**
- Supabase CLI configuration
- Initial migration capturing current schema
- Migration workflow documented

---

## 📁 Files to Create

### Testing Framework
```
vitest.config.ts                    # Vitest configuration
playwright.config.ts                # E2E test config
src/lib/test-utils.tsx              # Testing utilities (render with providers)
src/components/ui/Button.test.tsx   # Example component test
src/app/api/webhooks/whatsapp/signature.test.ts  # Critical security test
```

### Error Monitoring
```
sentry.client.config.ts             # Sentry client-side config
sentry.server.config.ts             # Sentry server-side config
next.config.js                      # Update with Sentry plugin
src/app/error.tsx                   # Root error boundary
src/app/[locale]/(main)/error.tsx   # Main app error boundary
```

### CI/CD
```
.github/workflows/ci.yml            # Main CI pipeline
.github/workflows/deploy.yml        # Deployment workflow (optional)
```

### Migrations
```
supabase/config.toml                # Supabase project config
supabase/migrations/001_initial.sql # Capture current schema
```

---

## 🔧 Technical Decisions

### Testing Strategy
**Coverage targets:**
- Critical paths: 100% (webhooks, auth, RLS)
- Business logic: 80%+
- UI components: 70%+
- Overall: 70%+ target

**What to test first:**
1. Webhook signature validation (security-critical)
2. API route handlers (conversational, voice, documents)
3. Real-time subscriptions (complex, error-prone)
4. i18n/RTL rendering (Phase 22 prep)
5. Core UI components (Button, Card from Phase 21)

### Error Monitoring Setup
**Sentry configuration:**
- Separate projects for client/server (better filtering)
- Source maps uploaded automatically (next build)
- Sample rate: 100% in dev, 10% in production (cost optimization)
- Performance monitoring: Enable for API routes

**Alert rules:**
- Critical: Any error in webhook handlers (Slack notification)
- High: >10 errors/min on any page (email)
- Medium: New error types (daily digest)

### CI/CD Pipeline Structure
```yaml
# Proposed workflow
name: CI
on: [push, pull_request]

jobs:
  lint:
    - ESLint check
    - Prettier format check

  typecheck:
    - tsc --noEmit

  test:
    - Vitest unit/integration tests
    - Upload coverage report

  build:
    - next build
    - Verify no build errors

  e2e:
    - Playwright tests (on main branch only)
```

### Migration Strategy
**Initial migration:**
1. `supabase db dump` to capture current schema
2. Create `001_initial.sql` with full schema
3. Future migrations: incremental changes only

**Migration workflow:**
- Local: `supabase migration new <name>` → write SQL → `supabase db reset` to test
- CI: Auto-apply migrations on deploy (staging first, then prod)
- Rollback: Keep migrations reversible where possible

---

## 🎯 Success Criteria

Phase 20 is complete when:

- [ ] **Testing:**
  - [ ] Vitest configured and running
  - [ ] Testing Library set up with React 19
  - [ ] Playwright configured for E2E
  - [ ] 10+ critical tests written (webhooks, API routes, auth)
  - [ ] Test coverage report generated
  - [ ] Coverage ≥ 30% (foundation, will grow in future phases)

- [ ] **Error Monitoring:**
  - [ ] Sentry integrated (client + server)
  - [ ] Error boundaries added to key routes
  - [ ] Source maps uploading correctly
  - [ ] Test error appears in Sentry dashboard
  - [ ] Alert rules configured

- [ ] **CI/CD:**
  - [ ] `.github/workflows/ci.yml` created
  - [ ] All jobs passing (lint, typecheck, test, build)
  - [ ] Badge added to README (optional)
  - [ ] Branch protection rules enabled (require CI pass)

- [ ] **Migrations:**
  - [ ] Supabase CLI installed and linked
  - [ ] Initial migration created
  - [ ] Migration workflow documented
  - [ ] Successfully run migration locally

---

## 📚 Related Documentation

**Codebase analysis:**
- [codebase/TESTING.md](../../codebase/TESTING.md) — Full testing analysis
- [codebase/CONCERNS.md](../../codebase/CONCERNS.md) — Critical gaps (lines 343-377)
- [codebase/STACK.md](../../codebase/STACK.md) — Current tech stack

**External resources:**
- Vitest: https://vitest.dev/guide/
- Testing Library: https://testing-library.com/docs/react-testing-library/intro
- Playwright: https://playwright.dev/docs/intro
- Sentry Next.js: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Supabase CLI: https://supabase.com/docs/guides/cli

**Prior decisions (STATE.md):**
- Next.js 16 with Turbopack (ensure test compatibility)
- Supabase SSR package (test with proper auth context)
- Manual TypeScript types (will be replaced after migrations setup)

---

## 🚧 Blockers & Dependencies

**Blockers:**
- None (this is the foundation phase)

**Dependencies:**
- Supabase project must be linkable (for CLI)
- GitHub repo must exist (for Actions)
- Sentry account needed (free tier sufficient)

**Enables:**
- Phase 21-26 all depend on having tests + monitoring
- Refactoring work in Phase 21 requires test coverage
- Performance optimization in Phase 24 needs baseline metrics

---

## 💡 Planning Notes

**Suggested plan breakdown:**
1. **20-01:** Testing Infrastructure (Vitest + Testing Library + Playwright setup + first tests)
2. **20-02:** Error Monitoring (Sentry integration + error boundaries)
3. **20-03:** CI/CD Pipeline (GitHub Actions + branch protection)
4. **20-04:** Database Migrations (Supabase CLI + initial migration + workflow)

**Or combine into 3 plans:**
1. **20-01:** Testing Infrastructure + First Tests
2. **20-02:** Error Monitoring + CI/CD Pipeline (natural pairing)
3. **20-03:** Database Migrations + Documentation

**Estimated complexity:** High (new infrastructure, multiple tools)

---

*Context prepared: 2026-02-02*
*Ready for: /gsd:plan-phase 20*
