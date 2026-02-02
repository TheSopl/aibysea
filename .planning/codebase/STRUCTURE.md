# Codebase Structure

**Analysis Date:** 2026-02-02

## Directory Layout

```
aibysea/
├── .planning/                  # GSD project management (roadmap, phases, plans)
├── public/                     # Static assets (images, icons, fonts)
│   ├── aibysea-logo-full.png  # New logo asset
│   └── new-login-logo.png     # New login screen logo
├── src/                        # Source code (app, components, lib, i18n)
│   ├── app/                    # Next.js App Router
│   │   ├── actions/            # Server Actions
│   │   ├── api/                # API Routes
│   │   ├── auth/               # Auth pages (callback)
│   │   ├── [locale]/           # Locale-based routing (en, ar)
│   │   │   ├── (main)/         # Main app layout group
│   │   │   ├── login/          # Login page
│   │   │   ├── conversations/  # Conversation detail pages
│   │   │   └── layout.tsx      # Locale root layout (fonts, direction)
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components (ResponsiveContainer, Grid, Stack)
│   │   ├── layout/             # Layout components (Sidebar, BottomNav, TopBar, MobileNav)
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── agents/             # Agent management components (modals, forms)
│   │   └── *.tsx               # Shared components (ConversationList, MessageBubble, etc.)
│   ├── lib/                    # Shared libraries and utilities
│   │   ├── supabase/           # Supabase client configurations
│   │   ├── whatsapp/           # WhatsApp API client
│   │   ├── telegram/           # Telegram API client
│   │   └── utils.ts            # Shared utilities (cn helper)
│   ├── i18n/                   # Internationalization configuration
│   │   ├── navigation.ts       # Internationalized routing helpers
│   │   ├── request.ts          # Server-side i18n setup
│   │   └── routing.ts          # Locale routing config
│   ├── hooks/                  # Custom React hooks (usePageTitle.ts - new)
│   ├── store/                  # Zustand state stores (inferred, not fully visible)
│   └── proxy.ts                # Next.js 16 middleware (renamed from middleware.ts)
├── messages/                   # i18n translation files (not detected - **CONCERN**)
├── node_modules/               # Dependencies (npm packages)
├── .git/                       # Git repository
├── .planning/                  # GSD planning artifacts
├── package.json                # Project manifest
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration (extensive design system)
├── next.config.ts              # Next.js configuration (next-intl plugin)
├── postcss.config.mjs          # PostCSS configuration
└── eslint.config.mjs           # ESLint configuration
```

## Directory Purposes

**src/app/**
- Purpose: Next.js App Router - pages, layouts, API routes
- Contains: Page components, route handlers, server actions
- Key subdirectories:
  - `[locale]/` - Dynamic locale segment for EN/AR routing
  - `(main)/` - Route group for authenticated app (shares layout)
  - `api/` - REST API endpoints and webhook handlers
  - `actions/` - Server Actions for mutations
- Subdirectories:
  - `[locale]/(main)/` contains all authenticated pages (dashboard, inbox, agents, voice, documents, settings)
  - `api/webhooks/` handles external system callbacks
  - `api/voice/`, `api/documents/` provide mock data APIs

**src/components/**
- Purpose: Reusable React components (Server + Client)
- Contains: TSX/JSX component files, organized by domain
- Key files:
  - `layout/Sidebar.tsx` - Desktop navigation (fixed left sidebar)
  - `layout/BottomNav.tsx` - Mobile bottom navigation (4+More pattern)
  - `layout/TopBar.tsx` - Page headers with back button support
  - `layout/MobileNav.tsx` - Drawer navigation for secondary items
  - `ConversationList.tsx`, `MessageList.tsx`, `MessageBubble.tsx` - Chat UI
  - `dashboard/AIMetricsDashboard.tsx` - Analytics widgets
  - `agents/AgentFormModal.tsx`, `agents/DeleteConfirmModal.tsx` - AI agent management
  - `LanguageToggle.tsx` - EN/AR language switcher (desktop only)
- Subdirectories:
  - `ui/` - Base responsive components (ResponsiveContainer, ResponsiveGrid, ResponsiveStack)
  - `layout/` - Layout primitives (Sidebar, BottomNav, TopBar, MobileNav)
  - `dashboard/` - Dashboard-specific widgets (MetricsCard, HealthScore, LatencyChart)
  - `agents/` - Agent management forms and modals

**src/lib/**
- Purpose: Shared libraries, utilities, service integrations
- Contains: TypeScript utility modules, API clients
- Key files:
  - `supabase/client.ts` - Browser Supabase client
  - `supabase/server.ts` - Server Supabase client (cookie-based)
  - `supabase/admin.ts` - Admin client (service role, RLS bypass)
  - `supabase/middleware.ts` - Auth middleware for Next.js
  - `whatsapp/client.ts` - WhatsApp Cloud API client
  - `whatsapp/signature.ts` - Webhook signature validation (timing-safe)
  - `whatsapp/types.ts`, `whatsapp/constants.ts` - WhatsApp type definitions
  - `telegram/client.ts`, `telegram/types.ts`, `telegram/constants.ts` - Telegram Bot API
  - `utils.ts` - Shared utilities (cn function for class merging)
- Subdirectories: Organized by external service (supabase/, whatsapp/, telegram/)

**src/i18n/**
- Purpose: Internationalization configuration (next-intl)
- Contains: Locale routing, navigation helpers
- Key files:
  - `routing.ts` - Locale configuration (en, ar), defaultLocale, localePrefix
  - `navigation.ts` - Internationalized Link, useRouter, usePathname
  - `request.ts` - Server-side i18n request configuration
- Subdirectories: None

**src/hooks/**
- Purpose: Custom React hooks
- Contains: `usePageTitle.ts` (new hook added)
- Subdirectories: None

**src/store/**
- Purpose: Zustand state management stores
- Contains: Navigation state, drawer state (inferred, not fully detected)
- Subdirectories: Likely flat structure

**messages/**
- Purpose: i18n translation JSON files (en.json, ar.json)
- Status: **NOT DETECTED** - Translation files may be in different location or inline
- Expected: `messages/en.json`, `messages/ar.json`

**.planning/**
- Purpose: GSD (Getting Shit Done) project management artifacts
- Contains: PROJECT.md, ROADMAP.md, STATE.md, phases/, archive/
- Subdirectories:
  - `phases/` - Phase execution plans (PLAN.md files)
  - `archive/` - Completed milestone archives
  - `milestones/` - Milestone roadmaps
  - `codebase/` - Codebase analysis documents (this file!)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx` - Root layout (global providers)
- `src/app/[locale]/layout.tsx` - Locale layout (fonts, dir attribute, i18n provider)
- `src/app/[locale]/(main)/layout.tsx` - Main app layout (sidebar + bottom nav)
- `src/proxy.ts` - Middleware (auth + i18n)

**Configuration:**
- `tsconfig.json` - TypeScript config (strict: true, path aliases @/*)
- `tailwind.config.js` - Extensive design system (custom breakpoints, colors, spacing, typography)
- `next.config.ts` - Next.js config with next-intl plugin
- `package.json` - Dependencies and scripts
- `eslint.config.mjs` - Linting rules (ESLint 9 flat config)

**Core Logic:**
- `src/lib/supabase/*` - Database access layer
- `src/lib/whatsapp/*`, `src/lib/telegram/*` - Messaging integrations
- `src/app/api/**/*.ts` - API routes and webhooks
- `src/app/actions/*` - Server actions (likely for mutations)

**Testing:**
- None detected (**CRITICAL GAP** - no test files, no test directory)

**Documentation:**
- `.planning/PROJECT.md` - Project context and business model
- `.planning/ROADMAP.md` - Development roadmap (v1.0-v4.0)
- `.planning/STATE.md` - Current project state
- `.planning/DESIGN-SYSTEM-V1.1.md` - Design system specification

## Naming Conventions

**Files:**
- PascalCase.tsx - React components (`ConversationList.tsx`, `MessageBubble.tsx`)
- kebab-case.ts - Utilities and services (`utils.ts`, `signature.ts`)
- route.ts - Next.js API route handlers (App Router convention)
- page.tsx - Next.js page components (App Router convention)
- layout.tsx - Next.js layout components (App Router convention)

**Directories:**
- kebab-case for all directories (`voice-agents/`, `processing-queue/`)
- Plural for collections (`components/`, `actions/`, `messages/`)
- [locale] - Dynamic segment for internationalization
- (main) - Route group (parentheses, not included in URL)

**Special Patterns:**
- layout.tsx - Shared layout for route segments
- page.tsx - Route endpoint (renders for URL)
- route.ts - API route handler (GET, POST, PUT, DELETE)
- [id]/ - Dynamic route segment (e.g., `/agents/[id]/edit`)
- (group)/ - Route group (doesn't affect URL structure)

## Where to Add New Code

**New Page:**
- Primary code: `src/app/[locale]/(main)/new-page/page.tsx`
- Translations: `messages/en.json`, `messages/ar.json` (add translation keys)
- Navigation: Update `src/components/layout/Sidebar.tsx` navigation config

**New Component:**
- Implementation: `src/components/ComponentName.tsx` (if shared) or `src/components/domain/ComponentName.tsx` (if domain-specific)
- Imports: Import in page or parent component
- Types: Define inline or in separate types file

**New API Route:**
- Definition: `src/app/api/new-endpoint/route.ts`
- Handler: Export GET, POST, PUT, DELETE functions
- Types: Use TypeScript for request/response types

**New Server Action:**
- Implementation: `src/app/actions/actionName.ts`
- Usage: Import in Server Component or Client Component (via useTransition)

**Utilities:**
- Shared helpers: `src/lib/utils.ts` or new file in `src/lib/`
- Type definitions: Inline or in `src/lib/types.ts`

## Special Directories

**src/app/[locale]/**
- Purpose: Dynamic locale routing for internationalization
- Source: next-intl plugin creates this pattern
- Committed: Yes (source code)
- Note: All pages must be nested under [locale] for i18n to work

**src/app/(main)/**
- Purpose: Route group for authenticated app pages (shared layout)
- Source: Next.js App Router convention
- Committed: Yes
- Note: Parentheses prevent group name from appearing in URL

**node_modules/**
- Purpose: npm package dependencies
- Source: Auto-generated by npm install
- Committed: No (.gitignored)

**.next/**
- Purpose: Next.js build output and cache
- Source: Auto-generated by Next.js during build/dev
- Committed: No (.gitignored)

**public/**
- Purpose: Static assets served at root URL
- Source: Developer-added images, fonts, icons
- Committed: Yes

---

*Structure analysis: 2026-02-02*
*Update when directory structure changes*
