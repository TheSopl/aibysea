# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-16)

**Core value:** Businesses can access enterprise-grade AI automation across conversational, voice, and document channels from one unified platform.
**Current focus:** v4.0 - Professional mobile compatibility with responsive design, mobile navigation, and performance optimization.

## Current Position

Phase: 18.1 of 19 (Internationalization)
Plan: 4 of 4 in current phase
Status: Phase complete
Last activity: 2026-02-01 — Completed 18.1-04-PLAN.md (Secondary Pages Translation)

Progress: ██████████████░░ 75% (v4.0 Phase 18.1 complete - 4/4 plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 42 (v1.0 + v2.0 + v3.0 + v4.0)
- Average duration: 9.5 min
- Total execution time: 7.4 hours

**By Phase (v1.0 + v2.0):**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 3 | 11 min | 4 min |
| 2 | 3 | 28 min | 9 min |
| 2.1 | 1 | 12 min | 12 min |
| 3 | 3 | 21 min | 7 min |
| 4 | 1 | 5 min | 5 min |
| 5 | 1 | 11 min | 11 min |
| 6 | 2 | 33 min | 16 min |
| 7 | 3 | 54 min | 18 min |
| 8 | 3 | 26 min | 8.7 min |
| 9 | 3 | 15 min | 5 min |
| 10 | 3 | 22 min | 7.3 min |
| 11 | 2 | 63 min | 31.5 min |
| 12 | 2 | 26 min | 13 min |
| 14 | 3 | 30 min | 10 min |
| 14.1 | 1 | 18 min | 18 min |
| 15 | 2 | 25 min | 12.5 min |
| 16 | 2 | 16 min | 8 min |
| 17 | 2 | 40 min | 20 min |
| 18 | 2 | 30 min | 15 min |
| 18.1 | 4 | 92 min | 23 min |

## Accumulated Context

### Decisions

Recent decisions affecting current work:

- **Phase 18.1-03:** Removed Turkish language support - application supports only EN/AR (per user request)
- **Phase 18.1-03:** Use Tailwind logical properties (start/end, ms/me, ps/pe) for RTL support throughout
- **Phase 18.1-03:** Preserve left-0 for fixed desktop sidebar (physical positioning, not logical)
- **Phase 18.1-02:** LanguageToggle uses iPhone-style segmented control (EN|AR) rather than dropdown
- **Phase 18.1-02:** Navigation config uses nameKey pattern for translations (resolved at render time)
- **Phase 18.1-02:** Desktop-only language toggle - mobile gets settings option in future
- **Phase 18.1-01:** Use next-intl with localePrefix: 'as-needed' for clean default locale URLs
- **Phase 18.1-01:** Integrate i18n middleware with proxy.ts (Next.js 16 renamed middleware.ts)
- **Phase 18.1-01:** IBM Plex Sans Arabic font for Arabic glyphs with RTL direction support
- **Phase 18.1-01:** All pages moved to [locale] dynamic segment for locale-based routing
- **Phase 18-02:** Use `lg:` breakpoint (1024px) consistently for master-detail toggle across all pages (not tablet: 768px)
- **Phase 18-02:** Stats grid pattern: grid-cols-2 md:grid-cols-4 with responsive icon sizes (w-10 sm:w-12)
- **Phase 18-01:** Master-detail toggle pattern: list hidden with `selectedItem && "hidden lg:flex"`, detail uses `fixed inset-0` on mobile
- **Phase 17-02:** Recharts ResponsiveContainer ignores className - must use wrapper div for responsive heights
- **Phase 17-02:** TopBar supports optional showBackButton prop for mobile navigation (lg:hidden)
- **Phase 17-01:** Message bubbles use 85% max-width on mobile with breakpoint cascade (85% → xs → sm → md)
- **Phase 17-01:** Touch target minimums: min-h-[44px] for buttons, min-h-[72px] for list items
- **Phase 16-02:** Drawer as "More" overflow with secondary navigation only (primary items in bottom nav)
- **Phase 16-02:** Swipe-to-close gesture threshold: 100px offset OR 500 velocity
- **Phase 16-02:** Keyboard detection via visualViewport API (0.8 threshold for keyboard visibility)
- **Phase 16-01:** 4+More pattern for bottom nav (Dashboard, Inbox, Agents, Voice visible, More opens drawer)
- **Phase 16-01:** 56px bottom nav height + safe-area-inset-bottom for notch phones
- **Phase 16-01:** Zustand navigation store for drawer/route/scroll state management
- **Phase 14.1-01:** Full-page editor for AI agents with collapsible sections (Instructions, Actions, Knowledge, Settings)
- **Phase 14.1-01:** Only animate last 6 messages in inbox for performance on long conversations
- **Phase 14.1-01:** Dashboard scrolling via inner content container with fixed outer background
- **Phase 14-03:** Fallback query pattern for graceful degradation when ai_agent_id column not yet applied
- **Phase 14-03:** AI agent context stored in message metadata for n8n (not separate webhook call)
- **Phase 14-03:** Optimistic UI updates with rollback for agent assignment changes
- **Phase 14-02:** Modal pattern with backdrop blur for form dialogs (AgentFormModal, DeleteConfirmModal)
- **Phase 14-02:** Optimistic UI updates with rollback for status toggle (instant feedback)
- **Phase 14-01:** Separate `ai_agents` table (not reusing `agents` which stores human agents)
- **Phase 14-01:** JSONB for triggers (array) and behaviors (object) for flexible schema
- **Phase 14-01:** Use `any` type assertion for admin client until Database types regenerated
- **Phase 11-02:** Document Intelligence API uses pure mock data, Supabase integration deferred to post-launch
- **Phase 11-02:** URL query parameters for filtering (type, status, from_date, to_date) enable flexible template and job queries
- **Phase 11-02:** Soft delete for templates via archived status rather than hard delete
- **Phase 11-01:** Voice agents API uses pure mock data, Supabase integration deferred to Phase 11-02
- **Phase 11-01:** URL query parameters for filtering (agent_id, status, from_date, to_date, direction) enable flexible frontend queries
- **Phase 11-01:** Pagination with limit/offset pattern, capped at 500 results per page
- **Phase 8-01:** Navigation structure uses 3 service modules (Conversational, Voice, Documents) with module icons and color metadata
- **Phase 8-01:** Service colors defined: accent (blue/purple) for Conversational, teal for Voice, orange for Documents
- Next.js 16 with Turbopack for faster dev experience
- Supabase SSR package for proper cookie handling in all contexts
- Manual TypeScript types (Supabase CLI needs linked project)
- Simple RLS: all authenticated agents see all data
- Use @whatsapp-cloudapi/types for zero-runtime TypeScript types
- Use crypto.timingSafeEqual for webhook signature verification
- Use service role client for webhook processing (RLS bypass)
- Store whatsapp_message_id as dedicated column for deduplication
- Track last_customer_message_at for 24h window enforcement
- Use type assertion for Supabase join queries (types don't infer correctly)
- Optimistic UI updates for takeover toggle (instant feedback, revert on error)
- Color-coded handler states: blue for AI, orange for human
- Auto-create agent records using admin client (system operation bypasses RLS)
- REPLICA IDENTITY FULL required for Supabase real-time on messages table
- Server wrapper + client component pattern for real-time subscriptions

### Roadmap Evolution

- v1.0 MVP shipped: 2026-01-13 (7 phases, 14 plans) — multi-channel conversational AI with unified inbox
- v1.0 Complete: 2026-01-14 (Phase 7 added) — AI Metrics & State Dashboard for operator visibility
- v2.0 Direction Change: 2026-01-16 — Pivot from v1.1 AI Cockpit to multi-service SaaS platform
- v2.0 Complete: 2026-01-16 (5 phases, 13 plans) — Voice Agents UI + Document Intelligence UI + Dark Mode
- v3.0 Created: 2026-01-17 (6 phases) — Backend & Integrations for real functionality
- Phase 13.1 inserted: 2026-01-20 — WhatsApp Integration as urgent work after Phase 13
- v3.0 Complete: 2026-01-26 (4 phases: 13, 13.1, 14, 14.1) — Messaging integrations and AI agent management
- v4.0 Created: 2026-01-26 (5 phases: 15-19) — Mobile Compatibility as urgent priority
- Phase 18.1 inserted: 2026-01-27 — Internationalization (EN/TR/AR) as URGENT business requirement

### Deferred Issues

- v1.1 AI Cockpit (Real-time HUD, Autonomy Showcase, State Transitions) — paused indefinitely
- End-to-end WhatsApp verification (Meta dashboard setup pending)
- Message search and filtering (deferred to v5.0)
- Conversation notes and templates (deferred to v5.0)
- Dashboard Metrics (real database queries for conversation counts, response times) — deferred to v5.0
- Voice Provider Integration (Twilio/Vonage, call handling, transcription) — deferred to v5.0
- Document Processing (OCR/extraction, template-based logic) — deferred to v5.0
- E2E Testing & Polish (integration tests, deployment readiness) — deferred to v5.0

### Blockers/Concerns

None blocking current development.

## Session Continuity

Last session: 2026-02-01
Stopped at: Completed 18.1-04-PLAN.md (Secondary Pages Translation) - Phase 18.1 complete
Resume file: None
Next action: Plan Phase 19 (Performance & Polish)
