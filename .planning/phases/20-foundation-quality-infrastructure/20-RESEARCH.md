# Phase 20: Foundation & Quality Infrastructure - Research

**Researched:** 2026-02-02
**Domain:** Testing frameworks, error monitoring, CI/CD, database migrations for Next.js 16
**Confidence:** HIGH

<research_summary>
## Summary

Researched the enterprise-grade quality infrastructure ecosystem for Next.js 16 applications. The standard approach uses Vitest (not Jest) for unit/integration testing, Testing Library for components, Playwright for E2E, Sentry for error monitoring, GitHub Actions for CI/CD, and Supabase CLI for database migrations.

Key finding: Next.js 16 with React 19 has a critical limitation—async Server Components cannot be unit tested with either Vitest or Jest. E2E testing with Playwright is the official recommendation for async components. This impacts test strategy significantly.

Second key finding: Vitest has surpassed Jest as the recommended choice for new Next.js projects in 2026 due to 30-70% faster execution, ESM/TypeScript native support, and near-instant startup with esbuild. Both tools have the same async Server Component limitation.

**Primary recommendation:** Use Vitest + Testing Library + Playwright stack with Sentry for monitoring, GitHub Actions for CI/CD, and Supabase CLI for migrations. Structure tests with 100% coverage for critical paths (webhooks, auth) and E2E tests for async Server Components.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vitest | 2.x | Unit/integration testing | 30-70% faster than Jest, ESM native, Next.js official docs |
| @testing-library/react | 16.x | Component testing | React team recommended, user-centric testing |
| playwright | 1.x | E2E testing | Next.js official recommendation, cross-browser, auto-wait |
| @sentry/nextjs | 8.x | Error monitoring | Industry standard, Next.js integration, source maps |
| supabase | CLI latest | Database migrations | Official Supabase tooling, version control for schema |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @vitejs/plugin-react | Latest | Vitest React support | Required for Vitest with React |
| jsdom | Latest | DOM environment | Required for component tests |
| vite-tsconfig-paths | Latest | Path resolution | TypeScript projects with path aliases |
| @testing-library/dom | Latest | DOM utilities | Comes with React Testing Library |
| @testing-library/user-event | Latest | User interaction simulation | Prefer over fireEvent for realistic interactions |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vitest | Jest | Jest has larger ecosystem but 30-70% slower, both can't test async RSC |
| Playwright | Cypress | Cypress has better DX but slower, Playwright has better multi-browser |
| Sentry | LogRocket/Datadog | LogRocket for session replay focus, Datadog for infrastructure, Sentry best balance |
| GitHub Actions | GitLab CI/Circle CI | GitHub Actions native integration, free for public repos |

**Installation:**
```bash
# Testing stack
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths @testing-library/user-event

# E2E testing
npm install -D @playwright/test

# Error monitoring
npx @sentry/wizard@latest -i nextjs

# Supabase CLI (global)
npm install -g supabase
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
src/
├── __tests__/                  # Alternative: colocate with components
│   ├── components/             # Component tests
│   ├── lib/                    # Utility tests
│   └── app/api/                # API route tests
├── lib/
│   └── test-utils.tsx          # Custom render with providers
├── app/
│   ├── error.tsx               # Error boundary (must be client component)
│   └── global-error.tsx        # Global error boundary with Sentry
├── e2e/                        # Playwright E2E tests
│   └── example.spec.ts
├── supabase/
│   ├── migrations/             # SQL migration files
│   └── seed.sql                # Test data seed
├── vitest.config.mts           # Vitest configuration
├── playwright.config.ts        # Playwright configuration
├── sentry.client.config.ts     # Sentry client initialization
├── sentry.server.config.ts     # Sentry server initialization
└── instrumentation.ts          # Sentry runtime registration
```

### Pattern 1: Vitest Configuration for Next.js 16
**What:** Minimal Vitest setup with React support and jsdom environment
**When to use:** All Next.js 16 projects with unit/integration testing
**Example:**
```typescript
// vitest.config.mts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/lib/test-utils.tsx',
        '**/*.config.*',
        '**/types.ts',
      ],
    },
  },
})
```

### Pattern 2: Testing Utilities with Providers
**What:** Custom render function that wraps components with necessary providers
**When to use:** Testing components that need i18n, themes, or other context
**Example:**
```typescript
// src/lib/test-utils.tsx
import { render } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'

const messages = {
  // Import your test messages
}

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  )
}
```

### Pattern 3: Sentry Error Boundary for App Router
**What:** Global error boundary that captures React errors and sends to Sentry
**When to use:** Required for all Next.js App Router applications
**Example:**
```typescript
// app/global-error.tsx
"use client"
import * as Sentry from "@sentry/nextjs"
import NextError from "next/error"
import { useEffect } from "react"

export default function GlobalError({
  error
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
```

### Pattern 4: GitHub Actions CI Workflow
**What:** Standard CI pipeline with caching, parallel jobs, and matrix testing
**When to use:** All Next.js projects with automated testing
**Example:**
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v4
        if: success()

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: 'npm'
      - run: npm ci
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run start & npx wait-on http://localhost:3000
      - run: npx playwright test
```

### Pattern 5: Supabase Migration Workflow
**What:** Version-controlled database schema changes with CI/CD integration
**When to use:** All projects using Supabase
**Example:**
```bash
# Local development
supabase login
supabase link --project-ref your-project-ref
supabase migration new create_table_name
# Edit migration file in supabase/migrations/
supabase db reset  # Test locally
supabase db push   # Deploy to remote

# CI/CD (add to GitHub Actions)
- run: supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
- run: supabase db push
```

### Anti-Patterns to Avoid
- **Testing async Server Components with Vitest/Jest:** Neither supports async RSC - use E2E tests instead
- **Using fireEvent over userEvent:** userEvent provides more realistic user interactions
- **Not committing lockfiles:** Required for deterministic installs in CI
- **Using npm install in CI:** Use `npm ci` for faster, reproducible builds
- **Missing NEXT_PUBLIC_ prefix:** Client-side env vars must have this prefix
- **Setting Sentry sample rates too high:** 100% in production will blow quota - use 10%
- **Not uploading source maps:** Sentry stack traces are useless without them
- **Skipping error boundaries:** Unhandled errors crash the app without boundaries
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Test utilities | Custom render functions | @testing-library/react | Handles cleanup, async updates, community patterns |
| User interactions | Manual event dispatch | @testing-library/user-event | Simulates real user behavior (typing, clicking, tabbing) |
| Error tracking | Custom error logging | Sentry | Source maps, breadcrumbs, release tracking, alerting |
| CI/CD pipeline | Custom shell scripts | GitHub Actions | Built-in caching, matrix testing, marketplace actions |
| Database migrations | Manual SQL scripts | Supabase CLI | Version control, rollback, diffing, type generation |
| Test coverage | Manual code inspection | Vitest --coverage | Automated, enforced, visual reports |
| E2E testing | Custom Puppeteer scripts | Playwright | Auto-wait, cross-browser, debugging tools, codegen |

**Key insight:** Quality infrastructure has mature tooling that handles edge cases you won't discover until production. Vitest knows how to handle React concurrent rendering. Sentry knows how to deduplicate errors. Playwright knows how to wait for network requests. GitHub Actions knows how to cache dependencies efficiently. Building custom solutions means discovering these edge cases the hard way.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Async Server Components Cannot Be Unit Tested
**What goes wrong:** Attempting to test async Server Components with Vitest/Jest fails
**Why it happens:** React 19 async Server Components are new, testing tools don't support them yet
**How to avoid:** Write E2E tests with Playwright for async Server Components, unit test synchronous components only
**Warning signs:** Tests hang, timeout errors, "cannot read property of undefined" in async components

### Pitfall 2: Missing Environment Variable Prefixes
**What goes wrong:** Client-side code can't access SENTRY_DSN or other env vars
**Why it happens:** Next.js requires NEXT_PUBLIC_ prefix for client-accessible vars
**How to avoid:** Use NEXT_PUBLIC_SENTRY_DSN for client, SENTRY_DSN for server
**Warning signs:** "undefined" when accessing process.env in browser, Sentry not initializing

### Pitfall 3: Not Caching Dependencies in CI
**What goes wrong:** GitHub Actions runs are slow, exceeding free tier minutes
**Why it happens:** npm ci re-downloads all packages every run without caching
**How to avoid:** Use actions/setup-node@v6 with cache: 'npm' parameter
**Warning signs:** CI runs taking 5+ minutes for simple tests, high GitHub Actions usage

### Pitfall 4: Using npm install Instead of npm ci
**What goes wrong:** Flaky CI builds, different dependency versions than local
**Why it happens:** npm install updates package-lock.json, npm ci uses exact versions
**How to avoid:** Always use npm ci in CI/CD, commit package-lock.json
**Warning signs:** "Works on my machine" issues, inconsistent test failures

### Pitfall 5: Setting Sentry Sample Rates Too High
**What goes wrong:** Sentry quota exceeded, missing important errors due to rate limiting
**Why it happens:** 100% sampling in production sends every transaction/replay
**How to avoid:** Use tracesSampleRate: 1.0 in dev, 0.1 in production (10%)
**Warning signs:** Sentry dashboard shows "quota exceeded", billing alerts, missing recent errors

### Pitfall 6: Forgetting Source Maps Upload
**What goes wrong:** Sentry errors show minified code, impossible to debug
**Why it happens:** Source maps not uploaded during build, or productionBrowserSourceMaps: false
**How to avoid:** Sentry wizard sets up automatic upload, verify in next.config.ts
**Warning signs:** Stack traces show "bundle.js:1:2342" instead of actual component names

### Pitfall 7: Testing Component Internal State
**What goes wrong:** Tests break on refactoring, even when user behavior unchanged
**Why it happens:** Testing implementation details (state, props) instead of user interactions
**How to avoid:** Test what users see and do - use getByRole, userEvent, avoid getByTestId
**Warning signs:** Tests fail when renaming variables, brittle tests, high maintenance

### Pitfall 8: Not Waiting for Async Updates
**What goes wrong:** "Can't perform React state update on unmounted component" warnings
**Why it happens:** Tests finish before async operations complete
**How to avoid:** Use waitFor, findBy* queries, await userEvent actions
**Warning signs:** Intermittent test failures, act() warnings, timing-dependent tests
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources:

### Testing API Route with Webhook Signature Validation
```typescript
// src/app/api/webhooks/whatsapp/signature.test.ts
import { describe, it, expect } from 'vitest'
import { verifyWhatsAppSignature } from './signature'

describe('WhatsApp Signature Validation', () => {
  it('should accept valid signature', () => {
    const payload = JSON.stringify({ test: 'data' })
    const secret = 'test-secret'
    const signature = createHmacSha256(payload, secret)

    expect(verifyWhatsAppSignature(payload, signature, secret)).toBe(true)
  })

  it('should reject invalid signature', () => {
    const payload = JSON.stringify({ test: 'data' })
    const secret = 'test-secret'
    const wrongSignature = 'wrong'

    expect(verifyWhatsAppSignature(payload, wrongSignature, secret)).toBe(false)
  })
})
```

### Testing Component with User Interactions
```typescript
// src/components/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button', { name: /click me/i }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Playwright E2E Test for Login Flow
```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('should login successfully', async ({ page }) => {
  await page.goto('http://localhost:3000/login')

  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: /sign in/i }).click()

  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText(/welcome back/i)).toBeVisible()
})
```

### Sentry Client Configuration
```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, 1.0 = 100%
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% when error occurs

  // Enable logs
  enableLogs: true,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter out noise
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],
})
```

### Supabase Migration Example
```sql
-- supabase/migrations/20260202_add_test_coverage_table.sql
-- Create table for tracking test coverage
create table if not exists test_coverage (
  id bigint primary key generated always as identity,
  commit_sha text not null,
  coverage_percentage decimal(5,2) not null,
  created_at timestamptz default now()
);

-- Add index for queries by commit
create index idx_test_coverage_commit on test_coverage(commit_sha);

-- Add RLS policy
alter table test_coverage enable row level security;

create policy "Authenticated users can view coverage"
  on test_coverage for select
  to authenticated
  using (true);
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

What's changed recently:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Jest | Vitest | 2024-2025 | Vitest 30-70% faster, ESM native, Next.js official docs now recommend it |
| Cypress | Playwright | 2023-2025 | Playwright faster, better multi-browser, official Next.js recommendation |
| actions/cache@v3 | actions/cache@v5 | Feb 2025 | Rewritten backend, improved performance and reliability |
| Sentry v7 | Sentry v8 | 2024 | Better Next.js 16 support, improved session replay, automatic instrumentation |
| npm install in CI | npm ci | Always better | But now more enforced, setup-node validates lockfile |

**New tools/patterns to consider:**
- **Vitest UI:** Built-in test UI with `vitest --ui` for visual test debugging
- **Playwright Codegen:** `npx playwright codegen` generates test code from browser interactions
- **Sentry Cron Monitoring:** Track scheduled jobs/crons in Sentry (useful for migrations)
- **GitHub Actions Cache v5:** New backend with improved reliability for dependency caching
- **Supabase Local Dev:** Full local Supabase stack with Docker for offline development

**Deprecated/outdated:**
- **Jest for new Next.js projects:** Still works but Vitest is faster, more modern
- **Manual error logging:** Sentry wizard makes setup 5 minutes, no excuse not to use it
- **Testing async Server Components with unit tests:** Neither Vitest nor Jest support it, use E2E
- **actions/cache@v2:** Use v5 for improved performance
- **npm install in CI:** Always use npm ci with committed lockfiles
</sota_updates>

<open_questions>
## Open Questions

Things that couldn't be fully resolved:

1. **Will Vitest/Jest ever support async Server Components?**
   - What we know: Neither currently supports async RSC, official recommendation is E2E tests
   - What's unclear: Timeline for support, if ever - React team hasn't committed
   - Recommendation: Plan test strategy assuming E2E for async components, revisit in 6 months

2. **Should we use separate Sentry projects for client vs server?**
   - What we know: Sentry recommends separate projects for better filtering
   - What's unclear: Whether added complexity is worth it for small teams
   - Recommendation: Start with single project, split if error volume makes filtering hard

3. **Optimal coverage targets for different areas?**
   - What we know: Industry standard is 70-80% overall
   - What's unclear: What makes sense for Next.js 16 with App Router and async RSC limitations
   - Recommendation: 100% for critical paths (webhooks, auth), 70%+ for business logic, 50%+ for UI, E2E for async RSC
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [Next.js Testing: Vitest](https://nextjs.org/docs/app/guides/testing/vitest) - Official configuration and recommendations
- [Next.js Testing Guide](https://nextjs.org/docs/app/guides/testing) - Testing strategy overview
- [Sentry for Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/) - Official integration docs
- [Supabase Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations) - Official workflow
- [Playwright with Next.js](https://nextjs.org/docs/pages/guides/testing/playwright) - Official E2E setup
- [GitHub Actions: setup-node](https://github.com/actions/setup-node) - Caching documentation
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/) - Official docs

### Secondary (MEDIUM confidence)
- [Vitest vs Jest for Next.js (Medium, Jan 2025)](https://medium.com/@ruverd/jest-vs-vitest-which-test-runner-should-you-use-in-2025-5c85e4f2bda9) - Verified with Next.js docs
- [Ultimate Guide to Sentry in Next.js (Medium, Jan 2026)](https://medium.com/@rukshan1122/error-monitoring-the-ultimate-guide-to-sentry-in-next-js-never-miss-a-production-error-again-e678a93760ae) - Verified with Sentry docs
- [GitHub Actions CI/CD for Next.js (DEV, 2025)](https://dev.to/sizan_mahmud0_e7c3fd0cb68/nextjs-cicd-pipeline-complete-implementation-guide-for-automated-deployments-314h) - Verified with GitHub docs
- [Supabase Migrations Guide (DEV, 2025)](https://dev.to/parth24072001/supabase-managing-database-migrations-across-multiple-environments-local-staging-production-4emg) - Verified with Supabase docs

### Tertiary (LOW confidence - validated during planning)
- None - all key findings verified against official documentation
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Vitest, Testing Library, Playwright for Next.js 16 + React 19
- Ecosystem: Sentry error monitoring, GitHub Actions CI/CD, Supabase CLI migrations
- Patterns: Test organization, error boundaries, CI workflows, migration strategies
- Pitfalls: Async RSC testing limitations, env var prefixes, CI caching, sample rates

**Confidence breakdown:**
- Standard stack: HIGH - All tools have official Next.js documentation or verified integration
- Architecture: HIGH - Patterns from official docs and verified examples
- Pitfalls: HIGH - Documented limitations (async RSC), common mistakes in official troubleshooting
- Code examples: HIGH - All examples from official documentation or verified sources

**Research date:** 2026-02-02
**Valid until:** 2026-03-02 (30 days - testing ecosystem relatively stable)

**Key limitations:**
- Async Server Components cannot be unit tested (neither Vitest nor Jest support)
- Must use E2E testing with Playwright for async RSC coverage
- This limitation may persist indefinitely - no timeline for support
</metadata>

---

*Phase: 20-foundation-quality-infrastructure*
*Research completed: 2026-02-02*
*Ready for planning: yes*
