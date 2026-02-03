# Project State

## Project Reference

See: docs/assistant/planning/PROJECT.md (updated 2026-01-16)

**Core value:** Businesses can access enterprise-grade AI automation across conversational, voice, and document channels from one unified platform.
**Current focus:** v5.0 - Enterprise transformation with production-grade quality, testing infrastructure, real service integrations, and design system polish.

## Current Position

Phase: 22 of 26 (Arabic & RTL Excellence)
Plan: 0 of TBD in current phase
Status: Not yet started
Last activity: 2026-02-03 — Completed 21-04-PLAN.md (Phase 21 complete)

Progress: ████████░░ 72.0% (v5.0 Phase 22 next - 8/8 Phase 21 plans done)

## Codebase Structure (Current)

**Route groups** (under `src/app/[locale]/`):
- `(app)` — Main authenticated application (dashboard, inbox, agents, voice, documents, settings, etc.)
- `(auth)` — Authentication (login, signup)
- `(public)` — Public pages (homepage, docs, pricing)

**Feature modules** (`src/features/`):
- `ai-agents/`, `auth/`, `channels/` (telegram, whatsapp), `contacts/`, `dashboard/`, `documents/`, `inbox/`, `voice/`

**UI components** (`src/components/ui/`):
- Button, Card, AnimatedCounter, FadeIn, PageTransition, ResponsiveContainer, ResponsiveGrid, ResponsiveStack

**Translations**: `src/messages/en.json`, `src/messages/ar.json`

**Styles**: `src/styles/globals.css`

## Performance Metrics

**Velocity:**
- Total plans completed: 55 (v1.0 + v2.0 + v3.0 + v4.0 + v5.0)
- Average duration: 28.5 min
- Total execution time: 24.1 hours

## Accumulated Context

### Decisions

Recent decisions affecting current work:

- **Phase 21-04:** Card component reworked: shadow→border, p-card→p-4 (enterprise density over template aesthetics)
- **Phase 21-04:** FadeIn animations removed everywhere (gimmicky, not polish); AnimatedCounter kept (showcases skill)
- **Phase 21-04:** Enterprise density standard: text-xl/2xl for metrics, p-3 cards, gap-3 grids, borders over shadows
- **Phase 21-03:** Systematic sed script approach for design token enforcement (efficient bulk replacements)
- **Phase 21-03:** Preserve standard Tailwind for small spacing (p-2, p-3) in component-internal contexts
- **Phase 21-03:** Service color coding enforced platform-wide (Voice=service-voice-*, Documents=service-documents-*)
- **Phase 21-03:** Button Framer Motion fix - omit onAnimationStart/End to prevent TypeScript conflicts
- **Phase 21-02:** Button md size as default (44px mobile touch target for accessibility)
- **Phase 21-02:** Card compound components pattern for flexible composition (Card.Header, Card.Title, etc.)
- **Phase 21-02:** Spring animations for interactive elements (buttons, interactive cards)
- **Phase 21-01:** Framer Motion for all animations (industry standard, React-native, excellent performance)
- **Phase 21-01:** Fast timing (150-300ms) for snappy feel per user requirement "crazy fancy but not overwhelming"
- **Phase 20-04:** Use npx for Supabase CLI (no global install, consistent across environments)
- **Phase 20-04:** npm ci with dependency caching for deterministic builds
- **Phase 20-04:** E2E tests only on main branch to save CI minutes
- **Phase 20-03:** Sentry free tier for error monitoring (5k errors/month)
- **Phase 20-02:** Playwright over Cypress (official Next.js recommendation)
- **Phase 20-01:** Vitest over Jest (30-70% faster, ESM native)
- **Phase 18.1-03:** Removed Turkish language support - application supports only EN/AR
- **Phase 18.1-03:** Use Tailwind logical properties (start/end, ms/me, ps/pe) for RTL support
- **Phase 18.1-01:** Use next-intl with localePrefix: 'as-needed' for clean URLs
- **Phase 18.1-01:** IBM Plex Sans Arabic font for Arabic glyphs

### Roadmap Evolution

- v1.0 MVP shipped: 2026-01-13 (7 phases, 14 plans)
- v2.0 Complete: 2026-01-16 (5 phases, 13 plans)
- v3.0 Complete: 2026-01-21 (4 phases, 7 plans)
- v4.0 Complete: 2026-01-27 (5 phases, 13 plans)
- v5.0 Created: 2026-02-02 (7 phases: 20-26)
- v5.0 Phase 20 complete: 2026-02-02
- v5.0 Phase 21 complete: 2026-02-03

### Deferred Issues

- **Sentry dashboard verification** — Deferred to production (Turbopack dev mode incompatibility)
- End-to-end WhatsApp verification (Meta dashboard setup pending)
- Message search and filtering
- Dashboard Metrics (real database queries)
- Voice Provider Integration (Twilio/Vonage, call handling, transcription)
- Document Processing (OCR/extraction, template-based logic)
- Multi-tenant RLS architecture (deferred from Phase 25 to future milestone)

### Blockers/Concerns

None blocking current development.

## Session Continuity

Last session: 2026-02-03
Stopped at: Completed Phase 21 (UI Design System Enforcement) — all 4 plans done
Resume file: docs/assistant/planning/phases/22-arabic-rtl-excellence/CONTEXT.md
Next action: Plan Phase 22 (Arabic & RTL Excellence)
