# Testing Patterns

**Analysis Date:** 2026-02-02

## Test Framework

**Runner:**
- None detected (**CRITICAL GAP** - no test framework configured)

**Assertion Library:**
- None detected

**Run Commands:**
- No test scripts in package.json

## Test File Organization

**Location:**
- No test files detected
- No __tests__/ directories
- No *.test.ts or *.spec.ts files

**Naming:**
- N/A (no tests)

**Structure:**
- N/A (no tests)

## Test Structure

**Suite Organization:**
- N/A (no tests)

**Patterns:**
- N/A (no tests)

## Mocking

**Framework:**
- N/A (no tests)

**Patterns:**
- N/A (no tests)

**What to Mock:**
- N/A (no tests)

**What NOT to Mock:**
- N/A (no tests)

## Fixtures and Factories

**Test Data:**
- Mock data hardcoded in API routes (Voice, Documents modules use mock data)
- Files: `src/app/api/voice/**/*.ts`, `src/app/api/documents/**/*.ts`
- Pattern: Inline mock arrays in API handlers (not proper test fixtures)

**Location:**
- No dedicated test fixtures directory

## Coverage

**Requirements:**
- No coverage requirements (no tests)

**Configuration:**
- No coverage tooling configured

**View Coverage:**
- N/A

## Test Types

**Unit Tests:**
- None detected

**Integration Tests:**
- None detected

**E2E Tests:**
- None detected

## Common Patterns

**Async Testing:**
- N/A (no tests)

**Error Testing:**
- N/A (no tests)

**Snapshot Testing:**
- N/A (no tests)

---

## CRITICAL TESTING GAPS

### 🚨 Priority 1: Zero Test Coverage

**Problem:**
- Entire codebase (121 TypeScript files) has ZERO tests
- No test framework configured
- No CI/CD testing pipeline

**Risk:**
- Breaking changes go undetected until production
- Refactoring is dangerous (no safety net)
- Webhook signature validation not tested (security risk)
- i18n/RTL functionality untested
- Database operations untested

**Recommended Testing Stack:**
- **Unit/Integration**: Vitest (fast, Vite-native, TypeScript-first)
- **E2E**: Playwright (Next.js recommended, cross-browser)
- **Component**: Testing Library (@testing-library/react)
- **Mocking**: vitest/vi (built-in to Vitest)

### 🎯 Critical Areas Requiring Tests

**1. Webhook Signature Validation (HIGH PRIORITY - Security)**
- File: `src/lib/whatsapp/signature.ts`
- Test: crypto.timingSafeEqual implementation
- Test: Invalid signature rejection
- Test: Timing attack resistance

**2. i18n/RTL Functionality (HIGH PRIORITY - User-facing)**
- Test: Locale routing (en vs ar paths)
- Test: RTL direction setting
- Test: Translation key resolution
- Test: Arabic font loading
- Test: Logical property usage (ms/me, ps/pe)

**3. API Routes (MEDIUM PRIORITY)**
- Test: Authentication checks
- Test: Input validation
- Test: Error responses
- Test: Status codes
- Files: `src/app/api/**/*.ts`

**4. Supabase Client Factory (MEDIUM PRIORITY)**
- Test: Client vs Server vs Admin client creation
- Test: Cookie handling in SSR
- Test: RLS behavior
- Files: `src/lib/supabase/*.ts`

**5. Real-time Subscriptions (LOW PRIORITY - Complex)**
- Test: Message subscription setup
- Test: Message deduplication
- Test: Connection handling

### 📋 Recommended Test Setup

**Step 1: Install Dependencies**
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@playwright/test": "^1.40.0",
    "happy-dom": "^12.0.0"
  }
}
```

**Step 2: Configure Vitest**
Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Step 3: Add Test Scripts**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test"
  }
}
```

**Step 4: Write First Tests**
Priority order:
1. `src/lib/whatsapp/signature.test.ts` - Webhook validation
2. `src/i18n/routing.test.ts` - Locale routing
3. `src/lib/utils.test.ts` - Utility functions
4. `src/app/api/webhooks/whatsapp/route.test.ts` - WhatsApp webhook
5. E2E: `e2e/auth.spec.ts` - Login flow
6. E2E: `e2e/inbox.spec.ts` - Message send/receive

---

*Testing analysis: 2026-02-02*
*Update when test patterns change*
