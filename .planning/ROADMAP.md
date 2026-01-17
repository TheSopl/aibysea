# Roadmap: AI BY SEA

## Milestones

- ✅ **[v1.0 MVP](milestones/v1.0-ROADMAP.md)** — Conversational AI with multi-channel inbox (Phases 1-7) — SHIPPED 2026-01-13
- ✅ **v2.0 Multi-Service Platform** — Voice Agents UI + Document Intelligence UI + Dark Mode (Phases 8-12) — COMPLETE 2026-01-16
- 🚧 **v3.0 Backend & Integrations** — Real backend connections, external service integrations (Phases 13-18) — IN PROGRESS

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

### 🚧 v3.0 Backend & Integrations (In Progress)

**Milestone Goal:** Transform the UI-complete platform into a fully functional system with real data flow, external service integrations for voice and document processing, and production-ready backend infrastructure.

#### Phase 13: Conversational Core

**Goal**: Verify the existing v1.0 conversational infrastructure works end-to-end — webhooks, message flow, real-time updates, and takeover toggle.

**Depends on**: v2.0 complete

**Research**: None (verification only)

**Plans**: 1

Plans:
- [ ] 13-01: Verification Plan - Build check, Telegram test, WhatsApp test (optional), real-time test, takeover test

#### Phase 14: AI Agent Management

**Goal**: Full CRUD for AI agents stored in database, configuration UI for personality/triggers/behaviors, and connecting agents to handle conversations.

**Depends on**: Phase 13

**Research**: Unlikely (internal patterns, Supabase CRUD)

**Plans**: TBD

Plans:
- [ ] 14-01: TBD

#### Phase 15: Dashboard Metrics

**Goal**: Replace mock dashboard data with real database queries — conversation counts, response times, AI confidence scores, health score calculations.

**Depends on**: Phase 14

**Research**: Unlikely (Supabase aggregate queries, internal patterns)

**Plans**: TBD

Plans:
- [ ] 15-01: TBD

#### Phase 16: Voice Provider Integration

**Goal**: Integrate real voice provider (Twilio/Vonage), phone number provisioning, inbound/outbound call handling, call recording and transcription.

**Depends on**: Phase 13

**Research**: Likely (external API integration, webhook patterns, telephony concepts)

**Research topics**: Twilio Voice API vs alternatives, phone number provisioning, call webhooks, recording/transcription options

**Plans**: TBD

Plans:
- [ ] 16-01: TBD

#### Phase 17: Document Processing

**Goal**: Integrate OCR/extraction provider (AWS Textract/Google Vision), implement template-based extraction logic, real processing queue with job status tracking.

**Depends on**: Phase 13

**Research**: Likely (external API integration, OCR accuracy patterns, extraction strategies)

**Research topics**: AWS Textract vs Google Vision vs alternatives, template matching strategies, confidence scoring

**Plans**: TBD

Plans:
- [ ] 17-01: TBD

#### Phase 18: End-to-End Testing & Polish

**Goal**: Integration tests across all services, error handling improvements, logging, and production deployment readiness.

**Depends on**: Phases 15, 16, 17

**Research**: Unlikely (testing patterns, deployment config)

**Plans**: TBD

Plans:
- [ ] 18-01: TBD

## Progress

**v1.0 MVP Execution:** ✅ Complete (Phases 1-7)
**v2.0 Multi-Service Platform:** ✅ Complete (Phases 8-12)
**v3.0 Backend & Integrations:** 🚧 In Progress (Phases 13-18)

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
| 13. Conversational Core | v3.0 | 0/? | Not started | - |
| 14. AI Agent Management | v3.0 | 0/? | Not started | - |
| 15. Dashboard Metrics | v3.0 | 0/? | Not started | - |
| 16. Voice Provider Integration | v3.0 | 0/? | Not started | - |
| 17. Document Processing | v3.0 | 0/? | Not started | - |
| 18. E2E Testing & Polish | v3.0 | 0/? | Not started | - |

**Overall Progress**: v3.0 — 0/6 phases complete
