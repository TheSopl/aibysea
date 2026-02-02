# Architecture

**Analysis Date:** 2026-02-02

## Pattern Overview

**Overall:** Next.js 16 App Router with Internationalized Multi-Service SaaS Platform

**Key Characteristics:**
- Server-first with selective client hydration (React Server Components + Client Components)
- Internationalized routing with locale-based paths (`/en/*`, `/ar/*`)
- Real-time data synchronization via Supabase subscriptions
- Webhook-driven external integrations (WhatsApp, Telegram, n8n)
- Multi-service architecture (Conversational AI, Voice Agents, Document Intelligence)

## Layers

**Presentation Layer (UI):**
- Purpose: User interface and interaction handling
- Contains: React Server Components (default), Client Components ('use client'), layouts, pages
- Location: `src/app/[locale]/**/*.tsx` (pages), `src/components/**/*.tsx` (reusable)
- Depends on: Actions (server actions), API routes, i18n translations
- Used by: End users via browser
- Pattern: Composition-based with Radix UI primitives + custom components

**Routing Layer:**
- Purpose: Handle i18n routing, middleware, authentication
- Contains: Next.js App Router with dynamic locale segment
- Location: `src/app/[locale]/`, `src/i18n/routing.ts`, `src/proxy.ts` (middleware)
- Key files:
  - `src/app/[locale]/layout.tsx` - Root locale layout (RTL/LTR direction, font loading)
  - `src/i18n/navigation.ts` - Internationalized Link and navigation helpers
  - `src/proxy.ts` - Next.js 16 middleware (renamed from middleware.ts)
- Depends on: next-intl middleware, Supabase middleware for auth
- Pattern: Middleware chain (auth → i18n → routing)

**API Layer:**
- Purpose: Backend endpoints for data operations, webhooks, integrations
- Contains: REST API routes (GET, POST, PUT, DELETE)
- Location: `src/app/api/**/*.ts`
- Structure:
  - `/api/auth/*` - Authentication (signup, callback)
  - `/api/webhooks/*` - Webhook receivers (WhatsApp, Telegram, n8n)
  - `/api/whatsapp/send` - Outbound messaging
  - `/api/telegram/send` - Outbound messaging
  - `/api/voice/*` - Voice agent management (mock data)
  - `/api/documents/*` - Document processing (mock data)
  - `/api/ai-agents/*` - AI agent CRUD
- Depends on: Supabase client, external API clients (WhatsApp, Telegram)
- Used by: Frontend components, external webhooks
- Pattern: Route handlers with service role client for database operations

**Service Layer (Implicit):**
- Purpose: Business logic and external service integrations
- Contains: Supabase clients, messaging clients, utility functions
- Location: `src/lib/**/*.ts`
- Key modules:
  - `src/lib/supabase/` - Database clients (client, server, admin, middleware)
  - `src/lib/whatsapp/` - WhatsApp Cloud API client, signature validation
  - `src/lib/telegram/` - Telegram Bot API client
  - `src/lib/utils.ts` - Shared utilities (clsx, cn helper)
- Depends on: External APIs, database, type definitions
- Used by: API routes, Server Components, Server Actions
- Pattern: Module-based services (not class-based)

**Data Layer:**
- Purpose: Database operations and real-time subscriptions
- Contains: Supabase PostgreSQL client, RLS policies
- Location: External (Supabase Cloud), accessed via `src/lib/supabase/*`
- Schema: Tables for conversations, messages, contacts, agents, ai_agents (from STATE.md context)
- Depends on: Supabase infrastructure
- Used by: All layers via Supabase client
- Pattern: Row Level Security (RLS) - simple model: all authenticated users see all data

**State Management Layer:**
- Purpose: Client-side state (navigation drawer, mobile menu, theme)
- Contains: Zustand stores (lightweight state management)
- Location: Likely `src/store/*` or inline hooks (not fully detected)
- Key state:
  - Navigation drawer state (open/closed)
  - Bottom nav routing state
  - Theme (dark mode) via localStorage + class toggle
- Pattern: Zustand for global state, React Context for providers (`src/components/Providers.tsx`)

## Data Flow

**HTTP Request (Page Load):**

1. User navigates to `/ar/dashboard` or `/en/inbox`
2. Next.js middleware executes (`src/proxy.ts`)
   - Supabase middleware checks authentication (cookie-based session)
   - next-intl middleware determines locale (ar or en)
3. Server Component renders (`src/app/[locale]/(main)/dashboard/page.tsx`)
   - Fetches data via Supabase server client
   - Translations loaded via next-intl (`getTranslations()`)
   - Direction determined (ar = rtl, en = ltr)
4. Client Components hydrate ('use client' components)
   - Real-time subscriptions established (Supabase channels)
   - Zustand stores initialize
5. Response returned to user (HTML + hydration data)

**Webhook Processing (Incoming Message):**

1. WhatsApp/Telegram webhook hits `/api/webhooks/whatsapp` or `/api/webhooks/telegram/[secret]`
2. Signature validation (`src/lib/whatsapp/signature.ts` - crypto.timingSafeEqual)
3. Message parsed and stored in database via admin client (bypasses RLS)
   - Auto-create contact if new phone number
   - Deduplicate via whatsapp_message_id
   - Trigger n8n webhook for AI processing (if AI handling enabled)
4. Real-time subscription broadcasts message to connected clients
5. Client updates conversation view optimistically

**State Management:**
- Server state: Fetched per request via Server Components (no persistent cache)
- Client state: Zustand stores for UI state, Supabase real-time for data sync
- Theme: localStorage + document.documentElement.classList manipulation

## Key Abstractions

**Internationalized Routing:**
- Purpose: Handle EN/AR locales with proper RTL support
- Implementation: next-intl with [locale] dynamic segment
- Files: `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`
- Pattern: All routes prefixed with locale (`/en/dashboard`, `/ar/لوحة`)

**Supabase Clients (3 variants):**
- Purpose: Database access with context-aware auth
- Types:
  - Client (`src/lib/supabase/client.ts`) - Browser, uses session cookies
  - Server (`src/lib/supabase/server.ts`) - Server Components, reads cookies
  - Admin (`src/lib/supabase/admin.ts`) - Service role, bypasses RLS
- Pattern: Factory functions returning configured clients

**Webhook Handlers:**
- Purpose: Receive and process external events
- Files: `src/app/api/webhooks/**/*.ts`
- Pattern: Signature validation → parse → database write → trigger downstream (n8n)

**Component System:**
- Purpose: Reusable UI building blocks
- Categories:
  - Base UI: `src/components/ui/*` (responsive containers, grids, stacks)
  - Layout: `src/components/layout/*` (Sidebar, BottomNav, TopBar, MobileNav)
  - Feature: `src/components/*` (ConversationList, MessageBubble, etc.)
  - Domain: `src/components/dashboard/*`, `src/components/agents/*`
- Pattern: Composition with Radix UI primitives + Tailwind styling

## Entry Points

**Application Entry:**
- Location: `src/app/layout.tsx` (root layout), `src/app/[locale]/layout.tsx` (locale layout)
- Triggers: All page requests
- Responsibilities:
  - Load fonts (Inter, JetBrains Mono, IBM Plex Sans Arabic)
  - Set HTML direction (rtl/ltr based on locale)
  - Initialize NextIntlClientProvider with messages
  - Apply theme (dark mode) via inline script
  - Wrap app with Providers component

**Main Application Layout:**
- Location: `src/app/[locale]/(main)/layout.tsx`
- Triggers: All authenticated main app pages
- Responsibilities: Desktop Sidebar + Mobile BottomNav + responsive layout

**API Entry Points:**
- Webhooks: First point of contact for external systems
- REST APIs: CRUD operations for Voice, Documents, AI Agents (mostly mock data currently)

## Error Handling

**Strategy:** Exception throwing with try/catch at boundaries (minimal error handling detected)

**Patterns:**
- API routes: Should wrap operations in try/catch (inconsistent implementation)
- Server Components: Errors bubble to error.tsx boundaries (not detected in codebase)
- Webhooks: Critical - signature validation prevents unauthorized access
- **GAP**: No global error reporting (no Sentry, no error monitoring)

## Cross-Cutting Concerns

**Logging:**
- console.log/console.error only (no structured logging)
- **GAP**: No production-ready logging infrastructure

**Validation:**
- Type safety via TypeScript (strict mode enabled)
- Webhook signature validation (WhatsApp timing-safe comparison)
- **GAP**: No runtime validation (no Zod schemas at API boundaries)

**Authentication:**
- Supabase Auth with cookie-based sessions (@supabase/ssr)
- Middleware enforces auth on protected routes (`src/lib/supabase/middleware.ts`)
- RLS: Simple model - all authenticated users access all data

**Internationalization:**
- next-intl with EN/AR locales
- RTL support: HTML dir attribute, Tailwind logical properties (ms/me, ps/pe, start/end)
- Fonts: IBM Plex Sans Arabic for Arabic glyphs
- Pattern: Translation keys via `useTranslations()` hook or `getTranslations()` server function

---

*Architecture analysis: 2026-02-02*
*Update when major patterns change*
