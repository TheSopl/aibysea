# Technology Stack

**Analysis Date:** 2026-02-02

## Languages

**Primary:**
- TypeScript 5.x - All application code (`tsconfig.json` with strict: true)

**Secondary:**
- JavaScript - Configuration files (`tailwind.config.js`, legacy configs)

## Runtime

**Environment:**
- Node.js 20.x+ (implicit from Next.js 16 requirements)
- Browser runtime - Client-side React components

**Package Manager:**
- npm (default)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.1.1 - React framework with App Router (`next.config.ts`)
- React 19.2.3 - UI library
- next-intl 4.7.0 - Internationalization with locale routing

**UI/Styling:**
- Tailwind CSS 4.1.18 - Utility-first CSS framework (`tailwind.config.js`)
- Radix UI - Headless component primitives (Avatar, Dialog, Dropdown, Tabs)
- Framer Motion 11.18.2 - Animation library
- Lucide React 0.562.0 - Icon system

**Testing:**
- None detected (no test framework configured - **CRITICAL GAP**)

**Build/Dev:**
- Next.js built-in bundler (Turbopack in dev, Webpack in prod)
- TypeScript compiler 5.x
- PostCSS 8.5.6 + Autoprefixer 10.4.23

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.90.1 - Database and authentication client (`src/lib/supabase/`)
- @supabase/ssr 0.8.0 - Server-side rendering utilities
- next-intl 4.7.0 - i18n with EN/AR support, RTL handling
- zustand 4.5.7 - State management (`src/store/` - if exists)

**Infrastructure:**
- clsx 2.1.1 + tailwind-merge 3.4.0 - Class name utilities (`src/lib/utils.ts`)
- recharts 2.15.4 - Chart library for dashboards
- numeral 2.0.6 - Number formatting
- uuid 13.0.0 - UUID generation

**Messaging/Integration:**
- @whatsapp-cloudapi/types 3.3.0 - WhatsApp type definitions
- Custom Telegram client - `src/lib/telegram/`
- n8n webhooks - Integration points in `src/app/api/webhooks/n8n/`

## Configuration

**Environment:**
- Environment variables (no .env.example found - **SECURITY CONCERN**)
- Supabase config: DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY (inferred)
- Messaging: WHATSAPP_*, TELEGRAM_* (inferred from code)

**Build:**
- `next.config.ts` - Next.js configuration with next-intl plugin
- `tailwind.config.js` - Extensive design system tokens (responsive breakpoints, custom colors, spacing scale)
- `tsconfig.json` - Strict TypeScript with path aliases (@/*)

## Platform Requirements

**Development:**
- Windows/macOS/Linux (cross-platform Node.js)
- No Docker detected
- Local Supabase instance or cloud project

**Production:**
- Vercel (typical for Next.js - inferred from stack)
- Supabase Cloud for database/auth
- Edge functions via Next.js middleware

---

*Stack analysis: 2026-02-02*
*Update after major dependency changes*
