# Coding Conventions

**Analysis Date:** 2026-02-02

## Naming Patterns

**Files:**
- PascalCase.tsx for React components (ConversationList.tsx, MessageBubble.tsx, AgentFormModal.tsx)
- kebab-case.ts for utilities and services (utils.ts, signature.ts, client.ts)
- route.ts for API route handlers (Next.js App Router convention)
- page.tsx for page components (Next.js App Router convention)
- layout.tsx for layout components (Next.js App Router convention)

**Functions:**
- camelCase for all functions (handleClick, fetchMessages, validateSignature)
- No special prefix for async functions (async signature is sufficient)
- Event handlers: handle[EventName] pattern (handleSubmit, handleToggle, handleDelete)
- API handlers: Named exports (GET, POST, PUT, DELETE) in route.ts files

**Variables:**
- camelCase for variables (messageList, isLoading, currentUser)
- UPPER_SNAKE_CASE for constants (WHATSAPP_API_VERSION, MAX_RETRIES)
- No underscore prefix for private members (TypeScript private keyword or # syntax)

**Types:**
- PascalCase for interfaces (no I prefix: User, Message, Conversation, not IUser)
- PascalCase for type aliases (UserConfig, ResponseData, NavigationItem)
- PascalCase for enums (not detected in codebase - likely using union types instead)
- Descriptive names: NavItem, ServiceModule, NavigationStructure (from Sidebar.tsx)

## Code Style

**Formatting:**
- Tool: Likely Prettier (no .prettierrc found - using defaults or ESLint integration)
- Line length: Not specified (likely 80-100 characters default)
- Quotes: Single quotes for strings (observed in code samples)
- Semicolons: Required (TypeScript convention)
- Indentation: 2 spaces (observed in TSX files)

**Linting:**
- Tool: ESLint 9 with flat config (eslint.config.mjs)
- Config: Next.js defaults (eslint-config-next 16.1.1)
- Run: `npm run lint`
- TypeScript: Strict mode enabled (`tsconfig.json`: strict: true)

**TypeScript:**
- Strict mode: Enabled (noImplicitAny, strictNullChecks, etc.)
- Path aliases: @/* maps to ./src/*
- Target: ES2017
- Module: esnext with bundler resolution
- JSX: react-jsx (automatic runtime)

## Import Organization

**Order:**
1. External packages (react, next, lucide-react, etc.)
2. Next.js specific imports (@/i18n/navigation, next-intl, next/font/google)
3. Internal modules (@/components, @/lib, @/store)
4. Relative imports (./ComponentName, ../utils)
5. Type imports (import type { } from ...)

**Grouping:**
- No blank lines observed between groups (inconsistent or not enforced)
- Alphabetical sorting not enforced

**Path Aliases:**
- @/* maps to src/*
- Example: `import { cn } from '@/lib/utils'`
- Example: `import { Link } from '@/i18n/navigation'`

## Error Handling

**Patterns:**
- Throw errors in services/libs, catch at boundaries (API routes, Server Components)
- API routes: Should wrap in try/catch and return error responses (inconsistent implementation)
- Webhooks: Critical signature validation before processing (WhatsApp uses crypto.timingSafeEqual)
- **GAP**: No global error boundaries detected (Next.js error.tsx not found in routes)

**Error Types:**
- Native Error class (no custom error types detected)
- HTTP errors: Return NextResponse with appropriate status codes
- Validation: Type safety via TypeScript (no runtime validation with Zod)

## Logging

**Framework:**
- console.log / console.error only (no structured logging library)
- No production logging infrastructure detected

**Patterns:**
- Development: console.log for debugging
- Production: stdout/stderr captured by Vercel
- **GAP**: No log levels, no structured logging, no context objects

## Comments

**When to Comment:**
- Complex business logic or non-obvious implementations
- Webhook security notes (e.g., "timing-safe comparison to prevent timing attacks")
- RTL/i18n considerations (e.g., "use logical properties for RTL support")
- TODO comments for incomplete features (observed: `// TODO: Send invite via API` in settings page)

**JSDoc/TSDoc:**
- Not consistently used (no @param, @returns annotations observed)
- TypeScript types serve as documentation
- **GAP**: Public APIs lack documentation

**TODO Comments:**
- Format: // TODO: description (no username or issue linking)
- Only 1 TODO found in entire codebase (in settings page)

## Function Design

**Size:**
- No strict limit observed
- React components vary widely (some 50+ lines, some 200+)
- **CONCERN**: Some components may be too large (needs review)

**Parameters:**
- Object destructuring in parameters preferred for React components
- Example: `function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> })`
- Type-first approach: inline type annotations or separate interface

**Return Values:**
- Explicit return statements for non-JSX
- JSX components return directly (no intermediate variables unless necessary)
- Async functions: Promise<T> return type (inferred or explicit)

## Module Design

**Exports:**
- Named exports preferred (components, utilities, functions)
- Default exports for Next.js conventions: page.tsx, layout.tsx, route.ts (Next.js App Router requires default export for pages/layouts)
- Example from Sidebar.tsx: Navigation config as const, component as default export

**Barrel Files:**
- Not detected (no index.ts files for re-exporting)
- Direct imports from specific files

**Module Boundaries:**
- Clear separation: lib/ for utilities, components/ for UI, app/ for pages/routes
- No circular dependencies detected (would cause build errors)

## React Patterns

**Server vs Client Components:**
- Server Components by default (Next.js 13+ App Router convention)
- 'use client' directive at top of file for client components
- Client components for: interactivity, hooks, browser APIs, real-time subscriptions
- Examples:
  - Server: page.tsx files (data fetching, static rendering)
  - Client: Sidebar.tsx, BottomNav.tsx, MessageListClient.tsx (interactivity, hooks)

**Component Composition:**
- Radix UI primitives for base components (Dialog, Dropdown, Avatar, Tabs)
- Compound components pattern (not extensively observed)
- Tailwind CSS for styling (utility-first approach)

**State Management:**
- Server state: Fetched per request in Server Components
- Client state: Zustand stores for global state (navigation, drawer)
- Local state: useState for component-specific state
- Real-time: Supabase subscriptions in Client Components

**Hooks:**
- next-intl: `useTranslations()` for i18n
- Custom hooks: `usePageTitle()` (new hook in src/hooks/)
- Radix UI hooks: Component-specific hooks from primitives

## Tailwind CSS Patterns

**Design System Tokens:**
- Custom breakpoints: xs (320px), sm (375px), md (428px), tablet (768px), lg (1024px), xl, 2xl
- Color system: primary (blue), accent (cyan), service-voice (green), service-documents (amber)
- Spacing scale: page, section, card with -sm, -md, -lg variants
- Typography scale: heading-1, heading-2, heading-3, body, body-sm, caption with responsive variants
- Shadows: card, teal-glow, purple-glow, service-*-glow

**Responsive Patterns:**
- Mobile-first approach: Base styles = mobile, breakpoints for larger screens
- Pattern: `class="px-4 sm:px-6 lg:px-8"` (progressive enhancement)
- Master-detail toggle: `selectedItem && "hidden lg:flex"` (hide list on mobile when detail shown)
- Touch targets: min-h-[44px] for buttons, min-h-[72px] for list items

**RTL Support:**
- Logical properties: ms/me (margin-start/end), ps/pe (padding-start/end), start/end
- Avoid: left/right in most cases (use for fixed positioning only, e.g., sidebar left-0)
- Direction set in HTML: `<html dir="rtl">` or `<html dir="ltr">` based on locale

**Utility Patterns:**
- clsx + tailwind-merge via cn() helper (`src/lib/utils.ts`)
- Example: `cn("base-classes", conditionalClasses && "conditional", className)`
- Dark mode: `dark:` variant (class-based dark mode via 'dark' class on html)

## API Route Patterns

**Route Handlers:**
- Named exports: GET, POST, PUT, DELETE
- Return NextResponse.json() for success
- Return NextResponse with status code for errors
- Example structure:
  ```ts
  export async function GET(request: Request) {
    try {
      // Logic
      return NextResponse.json({ data });
    } catch (error) {
      return NextResponse.json({ error: 'message' }, { status: 500 });
    }
  }
  ```

**Authentication:**
- Use Supabase server client for auth checks
- RLS handles authorization at database level

**Webhooks:**
- Signature validation REQUIRED (timing-safe comparison)
- Use admin client (service role) for database writes (bypasses RLS)
- Deduplication via unique IDs (whatsapp_message_id)

---

*Convention analysis: 2026-02-02*
*Update when patterns change*
