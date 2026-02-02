# Roadmap: AI BY SEA

## Milestones

- ✅ **[v1.0 MVP](milestones/v1.0-ROADMAP.md)** — Conversational AI with multi-channel inbox (Phases 1-7) — SHIPPED 2026-01-13
- ✅ **v2.0 Multi-Service Platform** — Voice Agents UI + Document Intelligence UI + Dark Mode (Phases 8-12) — COMPLETE 2026-01-16
- ✅ **v3.0 Backend & Integrations** — Real backend connections, messaging integrations (Phases 13-14.1) — COMPLETE 2026-01-21
- 🚧 **v4.0 Mobile Compatibility** — Professional responsive design, mobile navigation, performance (Phases 15-19) — IN PROGRESS
- 📋 **v5.0 Enterprise Transformation** — Production-grade quality, testing, real services, polish (Phases 20-26) — PLANNED

## Domain Expertise

None

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-7) — SHIPPED 2026-01-13</summary>

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** - Next.js + Supabase setup, agent authentication, database schema (3/3 plans)
- [x] **Phase 2: WhatsApp Integration** - Cloud API webhooks, message receiving and sending (3/3 plans)
- [x] **Phase 2.1: Telegram Integration** - INSERTED - Telegram bot webhook and messaging (1/1 plan)
- [x] **Phase 3: Inbox Core** - Two-panel layout, chat list, conversation view, contact management (3/3 plans)
- [x] **Phase 4: AI Integration** - n8n webhook endpoints, AI agent handling, conversation state tracking (1/1 plan)
- [x] **Phase 5: Human Takeover** - Agent takeover mechanism, AI pause/resume, notifications (1/1 plan)
- [x] **Phase 6: Real-time & Polish** - Live message updates, Supabase real-time, Arabic RTL support (2/2 plans)
- [x] **Phase 7: AI Metrics & State Dashboard** - Operator visibility into AI performance (3/3 plans)

**See [v1.0 Archive](milestones/v1.0-ROADMAP.md) for full phase details and decisions.**

</details>

<details>
<summary>✅ v2.0 Multi-Service Platform (Phases 8-12) — COMPLETE 2026-01-16</summary>

- [x] **Phase 8: Platform Restructure** - Unified navigation, 3-service module structure (3/3 plans)
- [x] **Phase 9: Voice Agents UI** - Agent cards, call logs, phone numbers pages (3/3 plans)
- [x] **Phase 10: Document Intelligence UI** - Upload, processing queue, template builder (3/3 plans)
- [x] **Phase 11: Backend Infrastructure** - API routes with mock data for Voice & Documents (2/2 plans)
- [x] **Phase 12: Dark Mode Implementation** - Full theme toggle across all pages (2/2 plans)

**Archived to:** `.planning/archive/v2.0-multi-service/`

</details>

<details>
<summary>✅ v3.0 Backend & Integrations (Phases 13-14.1) — COMPLETE 2026-01-21</summary>

**Milestone Goal:** Connect UI-complete platform to real backend infrastructure with messaging integrations.

- [x] **Phase 13: Conversational Core** - Verify v1.0 infrastructure, connect inbox to Supabase (1/1 plans)
- [x] **Phase 13.1: WhatsApp Integration** - INSERTED - Meta webhooks, bidirectional messaging (2/2 plans)
- [x] **Phase 14: AI Agent Management** - CRUD for AI agents, configuration UI, conversation assignment (3/3 plans)
- [x] **Phase 14.1: UI Enhancements** - INSERTED - Agent editor redesign, inbox animations, dashboard scrolling (1/1 plans)

**Deferred to v5.0:** Dashboard Metrics, Voice Provider Integration, Document Processing, E2E Testing

</details>

### 🚧 v4.0 Mobile Compatibility (In Progress)

**Milestone Goal:** Transform the platform into a professional, fully responsive application with mobile-first navigation and optimized performance across all devices.

#### Phase 15: Mobile Foundation & Design System ✅

**Goal**: Establish responsive breakpoints system, mobile-first CSS patterns, and touch-friendly base styles.

**Depends on**: v3.0 complete

**Research**: Unlikely (internal CSS patterns, Tailwind responsive utilities)

**Plans**: 2

Plans:
- [x] 15-01: Responsive Breakpoints & Design Tokens
- [x] 15-02: Responsive Components & Touch Targets

#### Phase 16: Navigation & Mobile UX ✅

**Goal**: Implement mobile navigation (hamburger menu, collapsible sidebar), bottom navigation for key actions, and mobile-optimized header components.

**Depends on**: Phase 15

**Research**: Unlikely (internal patterns, Radix/Tailwind docs)

**Plans**: 2

Plans:
- [x] 16-01: Navigation State & Bottom Nav
- [x] 16-02: Drawer Integration & Layout

#### Phase 17: Core Pages - Responsive Overhaul ✅

**Goal**: Mobile-responsive layouts for Inbox (conversation list, chat view), Dashboard (cards, metrics), and AI Agents pages.

**Depends on**: Phase 16

**Research**: Unlikely (internal UI work)

**Plans**: 2

Plans:
- [x] 17-01: Inbox Mobile Responsive
- [x] 17-02: Dashboard and Agents Responsive

#### Phase 18: Secondary Pages - Responsive (In Progress)

**Goal**: Mobile-responsive layouts for Voice Agents, Document Intelligence, Settings, and profile pages.

**Depends on**: Phase 17

**Research**: Unlikely (internal UI work)

**Plans**: 3

Plans:
- [x] 18-01: Call Logs Responsive
- [x] 18-02: Voice Module Responsive (Voice Agents, Phone Numbers, Voice Settings)
- [ ] 18-03: Document Intelligence Responsive (Upload, Templates)

#### Phase 18.1: Internationalization (INSERTED) ✅

**Goal**: Full i18n support with language switcher for English and Arabic - enabling the entire platform to be used in both languages with full RTL support.

**Depends on**: Phase 18 (can run in parallel with 18-03)

**Research**: Complete (next-intl is standard pattern)

**Plans**: 4/4 complete

Plans:
- [x] 18.1-01: i18n Infrastructure (next-intl, [locale] routing, RTL Arabic support)
- [x] 18.1-02: Translation Files & Language Switcher
- [x] 18.1-03: RTL CSS & Core Pages (Turkish removed per user request)
- [x] 18.1-04: Secondary Pages Translation

**Archived to:** `.planning/archive/v4.0-mobile/18.1-internationalization/`

#### Phase 19: Performance & Polish

**Goal**: Bundle optimization, lazy loading, image optimization, loading states, and final professional polish pass.

**Depends on**: Phase 18.1

**Research**: Unlikely (Next.js optimization patterns)

**Plans**: TBD

Plans:
- [ ] 19-01: TBD

### 📋 v5.0 Enterprise Transformation (Planned)

**Milestone Goal:** Transform the platform into enterprise-grade software with comprehensive testing, error monitoring, real service integrations, UI design system enforcement, Arabic/RTL excellence, and production-ready quality across all features.

#### Phase 20: Foundation & Quality Infrastructure

**Goal**: Establish testing framework, error monitoring, CI/CD pipeline, and database migration system for enterprise-grade development practices.

**Depends on**: v4.0 complete

**Research**: Likely (testing frameworks, monitoring tools, CI/CD setup)

**Research topics**: Vitest vs Jest for Next.js 16, Sentry setup, GitHub Actions configuration, Supabase CLI migrations

**Plans**: TBD

Plans:
- [ ] 20-01: TBD (run /gsd:plan-phase 20 to break down)

#### Phase 21: UI Design System Enforcement

**Goal**: Create unified Button and Card components, enforce Tailwind design tokens across all pages, eliminate spacing/typography/color inconsistencies.

**Depends on**: Phase 20

**Research**: Unlikely (internal patterns, existing design system)

**Plans**: TBD

Plans:
- [ ] 21-01: TBD

#### Phase 22: Arabic & RTL Excellence

**Goal**: Complete Arabic translation coverage, audit and fix RTL layout issues, implement locale-aware date/number formatting, verify Arabic font loading.

**Depends on**: Phase 21

**Research**: Unlikely (next-intl established, RTL patterns known)

**Plans**: TBD

Plans:
- [ ] 22-01: TBD

#### Phase 23: Real Service Integrations

**Goal**: Replace mock data with real integrations for Voice Agents (Twilio/ElevenLabs/Bland.ai) and Document Intelligence (GPT-4 Vision, OCR), connect to Supabase.

**Depends on**: Phase 22

**Research**: Likely (voice provider APIs, document processing services)

**Research topics**: Twilio Voice API, ElevenLabs/Bland.ai integration, GPT-4 Vision API for document extraction, OCR services

**Plans**: TBD

Plans:
- [ ] 23-01: TBD

#### Phase 24: Performance Optimization

**Goal**: Implement code splitting for heavy dependencies (Recharts), fix N+1 queries, optimize images, add Lighthouse CI, monitor Core Web Vitals.

**Depends on**: Phase 23

**Research**: Unlikely (Next.js optimization patterns, React performance best practices)

**Plans**: TBD

Plans:
- [ ] 24-01: TBD

#### Phase 25: Enterprise Security & Architecture

**Goal**: Implement multi-tenant RLS policies, unify webhook security (HMAC for all), add rate limiting, create .env.example, audit service role usage.

**Depends on**: Phase 24

**Research**: Likely (multi-tenant architecture patterns, rate limiting solutions)

**Research topics**: Organization-based RLS patterns, Upstash Rate Limit vs Vercel KV, multi-tenancy migration strategy

**Plans**: TBD

Plans:
- [ ] 25-01: TBD

#### Phase 26: Documentation & Developer Experience

**Goal**: Create API documentation (OpenAPI), set up Storybook for component library, write deployment guide, add architecture diagrams.

**Depends on**: Phase 25

**Research**: Unlikely (standard documentation tools)

**Plans**: TBD

Plans:
- [ ] 26-01: TBD

## Progress

**v1.0 MVP Execution:** ✅ Complete (Phases 1-7)
**v2.0 Multi-Service Platform:** ✅ Complete (Phases 8-12)
**v3.0 Backend & Integrations:** ✅ Complete (Phases 13-14.1)
**v4.0 Mobile Compatibility:** 🚧 In Progress (Phases 15-19)
**v5.0 Enterprise Transformation:** 📋 Planned (Phases 20-26)

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 3/3 | Complete | 2026-01-10 |
| 2. WhatsApp Integration | v1.0 | 3/3 | Complete | 2026-01-12 |
| 2.1. Telegram Integration | v1.0 | 1/1 | Complete | 2026-01-12 |
| 3. Inbox Core | v1.0 | 3/3 | Complete | 2026-01-12 |
| 4. AI Integration | v1.0 | 1/1 | Complete | 2026-01-12 |
| 5. Human Takeover | v1.0 | 1/1 | Complete | 2026-01-12 |
| 6. Real-time & Polish | v1.0 | 2/2 | Complete | 2026-01-13 |
| 7. AI Metrics & State Dashboard | v1.0 | 3/3 | Complete | 2026-01-14 |
| 8. Platform Restructure | v2.0 | 3/3 | Complete | 2026-01-16 |
| 9. Voice Agents UI | v2.0 | 3/3 | Complete | 2026-01-16 |
| 10. Document Intelligence UI | v2.0 | 3/3 | Complete | 2026-01-16 |
| 11. Backend Infrastructure | v2.0 | 2/2 | Complete | 2026-01-16 |
| 12. Dark Mode Implementation | v2.0 | 2/2 | Complete | 2026-01-16 |
| 13. Conversational Core | v3.0 | 1/1 | Complete | 2026-01-19 |
| 13.1. WhatsApp Integration | v3.0 | 2/2 | Complete | 2026-01-21 |
| 14. AI Agent Management | v3.0 | 3/3 | Complete | 2026-01-21 |
| 14.1. UI Enhancements | v3.0 | 1/1 | Complete | 2026-01-21 |
| 15. Mobile Foundation | v4.0 | 2/2 | Complete | 2026-01-27 |
| 16. Navigation & Mobile UX | v4.0 | 2/2 | Complete | 2026-01-27 |
| 17. Core Pages Responsive | v4.0 | 2/2 | Complete | 2026-01-27 |
| 18. Secondary Pages Responsive | v4.0 | 2/3 | In progress | - |
| 18.1. Internationalization | v4.0 | 3/4 | In progress | - |
| 19. Performance & Polish | v4.0 | 0/? | Not started | - |
| 20. Foundation & Quality Infrastructure | v5.0 | 0/? | Not started | - |
| 21. UI Design System Enforcement | v5.0 | 0/? | Not started | - |
| 22. Arabic & RTL Excellence | v5.0 | 0/? | Not started | - |
| 23. Real Service Integrations | v5.0 | 0/? | Not started | - |
| 24. Performance Optimization | v5.0 | 0/? | Not started | - |
| 25. Enterprise Security & Architecture | v5.0 | 0/? | Not started | - |
| 26. Documentation & Developer Experience | v5.0 | 0/? | Not started | - |

**Overall Progress**: v4.0 — 3/6 phases complete (18, 18.1, 19 remaining)
