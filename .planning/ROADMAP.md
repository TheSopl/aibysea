# Roadmap: AI BY SEA v2.0 Multi-Service SaaS Platform

## Milestones

- ✅ **[v1.0 MVP](milestones/v1.0-ROADMAP.md)** — Conversational AI with multi-channel inbox (Phases 1-7) — SHIPPED 2026-01-13
- ✅ **v2.0 Multi-Service Platform** — Add Voice Agents + Document Intelligence services (Phases 8-11) — COMPLETE 2026-01-16

## Domain Expertise

None

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-6) — SHIPPED 2026-01-13</summary>

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

**See [v1.0 Archive](milestones/v1.0-ROADMAP.md) for full phase details and decisions.**

</details>

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-6) — SHIPPED 2026-01-13</summary>

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

**See [v1.0 Archive](milestones/v1.0-ROADMAP.md) for full phase details and decisions.**

</details>

### 🚧 v2.0 Multi-Service Platform (In Progress)

**Milestone Goal:** Transform AI BY SEA into a comprehensive SaaS platform offering three premium services (Conversational AI, Voice Agents, Document Intelligence) from a unified dashboard. Establish the architecture and UI structure to serve customers willing to pay $5K-50K/month per service bundle.

#### Phase 8: Platform Restructure

**Goal**: Build unified platform navigation and dashboard that showcases all 3 services cohesively with service-specific color coding and metrics.

**Depends on**: Phase 7 (v1.0 complete)

**Research**: Unlikely (established design patterns, extending existing UI)

**Plans**: 3 total

Plans:
- [ ] 08-01: Update sidebar navigation with 3-service module structure (Conversational, Voice, Documents)
- [ ] 08-02: Redesign dashboard to show health/status of all 3 services with unified metrics
- [ ] 08-03: Implement service-specific color coding (teal for voice, orange for documents) and design extensions

#### Phase 9: Voice Agents UI

**Goal**: Complete UI module for voice agent management, call handling, and phone number configuration.

**Depends on**: Phase 8

**Research**: Unlikely (similar patterns to existing chat agents UI)

**Plans**: 3 total

Plans:
- [x] 09-01: Create Voice Agents list page with agent cards, status, metrics, and controls
- [x] 09-02: Create Call Logs page with call history, transcription viewer, and filtering
- [x] 09-03: Create Phone Numbers and Voice Settings pages

#### Phase 10: Document Intelligence UI

**Goal**: Complete UI module for document processing, templates, and AI-powered data extraction.

**Depends on**: Phase 8

**Research**: Unlikely (new feature area, standard UI patterns)

**Plans**: 3 total

Plans:
- [x] 10-01: Create Upload & Process page with drag-drop, template selection, progress tracking
- [x] 10-02: Create Processing Queue and Extracted Data pages with visualization and editing
- [ ] 10-03: Create Template Builder for custom extraction rules and export configurations

**Status**: 2 of 3 plans complete (started 2026-01-16)

#### Phase 11: Backend Infrastructure

**Goal**: Create API routes, mock data, and database schema extensions to support Voice Agents and Document Intelligence services.

**Depends on**: Phases 8-10

**Research**: Unlikely (following established API patterns from v1.0)

**Plans**: 2 total

Plans:
- [x] 11-01: Create API routes for voice agents (CRUD, call logs, phone numbers) with mock data
- [x] 11-02: Create API routes for document processing with mock templates; extend Supabase schema

**Status**: ✅ 2 of 2 plans complete (started 2026-01-16, finished 2026-01-16)

#### Phase 12: Dark Mode Implementation

**Goal**: Implement fully functional dark mode toggle with consistent styling across all pages - white text on dark slate background for dark mode, black text on light background for light mode.

**Depends on**: Phase 11

**Research**: ✅ Complete (12-RESEARCH.md) - Tailwind v4 dark mode patterns documented

**Plans**: 2 total

Plans:
- [x] 12-01: Fix Tailwind v4 Dark Mode Configuration (add @variant directive, verify theme toggle works)
- [ ] 12-02: Apply Dark Mode Classes to All Pages (update 15+ pages with dark: variants matching /documents reference)

**Details:**
Phase 12 fixes the non-functional theme toggle by adding the missing `@variant dark` directive required by Tailwind v4, then systematically applies dark mode classes to all application pages. The `/documents` page serves as the reference for perfect dark slate blue styling.

## Progress

**v1.0 MVP Execution:** ✅ Complete (Phases 1-7)
All phases shipped successfully: 1 → 2 → 2.1 (inserted) → 3 → 4 → 5 → 6 → 7

**v2.0 Multi-Service Platform:** 🚧 In Progress (Phases 8-11)

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
| 12. Dark Mode Implementation | v2.0 | 1/2 | In Progress | - |

**Overall Progress**: ██████████████░░ 97% (28/29 plans completed) — Phase 12 in progress
