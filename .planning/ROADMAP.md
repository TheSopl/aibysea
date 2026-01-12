# Roadmap: AIBYSEA

## Overview

Build an internal multi-channel inbox for WhatsApp customer conversations. Start with foundation and auth, integrate WhatsApp Cloud API, build the unified inbox UI, add AI-first conversation handling via n8n, implement human takeover flow, and polish with real-time updates and Arabic RTL support.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** - Next.js + Supabase setup, agent authentication, database schema
- [x] **Phase 2: WhatsApp Integration** - Cloud API webhooks, message receiving and sending
- [x] **Phase 2.1: Telegram Integration** - INSERTED - Telegram bot webhook and messaging
- [ ] **Phase 3: Inbox Core** - Two-panel layout, chat list, conversation view, contact management
- [ ] **Phase 4: AI Integration** - n8n webhook endpoints, AI agent handling, conversation state tracking
- [ ] **Phase 5: Human Takeover** - Agent takeover mechanism, AI pause/resume, notifications
- [ ] **Phase 6: Real-time & Polish** - Live message updates, Supabase real-time, Arabic RTL support

## Phase Details

### Phase 1: Foundation
**Goal**: Project scaffolding with authentication and database ready
**Depends on**: Nothing (first phase)
**Research**: Unlikely (established Next.js + Supabase patterns)
**Plans**: 3

Key deliverables:
- Next.js project with TypeScript
- Supabase project connected
- Agent authentication (login/logout)
- Database schema for contacts, conversations, messages
- Basic app shell/layout

### Phase 2: WhatsApp Integration
**Goal**: Send and receive WhatsApp messages through Cloud API
**Depends on**: Phase 1
**Research**: Complete
**Plans**: 3

Key deliverables:
- Webhook endpoint for incoming messages
- WhatsApp Cloud API client for sending
- Message persistence to database
- Webhook verification flow

### Phase 2.1: Telegram Integration (INSERTED)
**Goal**: Add Telegram as alternative messaging channel
**Depends on**: Phase 1 (database schema)
**Research**: Not needed (simple Bot API)
**Plans**: 1

Key deliverables:
- Telegram webhook endpoint
- Message receiving and persistence
- Message sending client
- Same database schema as WhatsApp (channel='telegram')

### Phase 3: Inbox Core
**Goal**: Functional two-panel inbox where agents see and respond to conversations
**Depends on**: Phase 2
**Research**: Unlikely (internal UI patterns)
**Plans**: TBD

Key deliverables:
- Two-panel layout (chat list + conversation)
- Chat list with recent conversations
- Conversation view with message history
- Message compose and send
- Contact management (phone as primary ID)

### Phase 4: AI Integration
**Goal**: AI agent handles conversations via n8n until stuck or human requested
**Depends on**: Phase 3
**Research**: Likely (external service)
**Research topics**: n8n webhook patterns, conversation state management, AI handoff triggers
**Plans**: TBD

Key deliverables:
- Webhook endpoints for n8n
- Conversation state tracking (AI-handled vs human)
- AI agent assignment per conversation
- Trigger detection (stuck / human requested)

### Phase 5: Human Takeover
**Goal**: Agents can take over from AI and re-enable AI when done
**Depends on**: Phase 4
**Research**: Unlikely (internal patterns building on Phase 4)
**Plans**: TBD

Key deliverables:
- Takeover button/action for agents
- AI auto-pause on takeover
- Visual indicator of conversation owner (AI vs human)
- Dropdown to re-assign AI to conversation
- Agent notifications for takeover-needed conversations

### Phase 6: Real-time & Polish
**Goal**: Live updates and Arabic-ready UI for internal rollout
**Depends on**: Phase 5
**Research**: Unlikely (Supabase real-time well-documented)
**Plans**: TBD

Key deliverables:
- Supabase real-time subscriptions
- Live message updates without refresh
- New conversation notifications
- Arabic RTL layout support
- UI polish for internal release

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-01-10 |
| 2. WhatsApp Integration | 3/3 | Complete | 2026-01-12 |
| 2.1 Telegram Integration | 1/1 | Complete | 2026-01-12 |
| 3. Inbox Core | 0/TBD | Not started | - |
| 4. AI Integration | 0/TBD | Not started | - |
| 5. Human Takeover | 0/TBD | Not started | - |
| 6. Real-time & Polish | 0/TBD | Not started | - |
