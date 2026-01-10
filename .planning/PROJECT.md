# AIBYSEA

## What This Is

An internal multi-channel inbox for handling customer conversations across messaging platforms, starting with WhatsApp. Agents log into a unified console to view all chats, with AI handling first contact and seamless human takeover. Built for internal company use as a respond.io alternative.

## Core Value

The unified inbox works reliably — all WhatsApp messages appear in one place and agents can respond without messages getting lost.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Agent authentication and login
- [ ] WhatsApp Cloud API integration (receive and send messages)
- [ ] Unified inbox: two-panel layout (chat list + active conversation)
- [ ] Contact management with phone number as primary identifier
- [ ] AI agent per channel that handles full conversation until stuck or customer requests human
- [ ] Human takeover: agent clicks to take over, AI auto-pauses
- [ ] AI re-enable: dropdown to manually re-assign AI to conversation
- [ ] Webhook endpoints for n8n integration (initial AI orchestration)
- [ ] Real-time message updates
- [ ] Arabic RTL support for final internal release

### Out of Scope

- Analytics and reporting dashboards — not needed for MVP
- Customer-facing portal — customers don't need to see their chat history
- Multi-tenant/SaaS capabilities — single company use only
- Channels beyond WhatsApp — future phases after WhatsApp is solid
- In-app AI logic builder — n8n handles AI orchestration for MVP

## Context

**Background:**
- Replacing reliance on external tools like respond.io
- Company needs control over customer communication infrastructure
- AI-first approach: automate routine conversations, humans handle edge cases

**Technical Environment:**
- WhatsApp Business API already verified and ready
- n8n available for initial AI orchestration workflows
- Team familiar with low-code approaches

**User Workflow:**
1. Customer sends WhatsApp message
2. AI agent responds, handles conversation
3. If AI gets stuck or customer asks for human → human agent sees notification
4. Human clicks to take over, AI pauses
5. Human handles conversation, can re-enable AI when done

## Constraints

- **Timeline**: 3-month deadline for internal-use MVP
- **Language**: UI in English during development, Arabic-first before company rollout
- **Tech Stack**: Next.js + Supabase (real-time, auth, PostgreSQL)
- **Hosting**: Vercel + Supabase Cloud (managed, minimal DevOps)
- **Development**: Claude Code + GSD doing heavy lifting, low-code developer

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js + Supabase stack | Real-time built-in, auth included, PostgreSQL, good for chat apps | — Pending |
| Vercel + Supabase Cloud hosting | Managed hosting, minimal DevOps, free tiers to start | — Pending |
| Phone number as primary contact identifier | WhatsApp always has phone, simplifies matching | — Pending |
| n8n for initial AI orchestration | Decouple AI logic, iterate fast without code changes | — Pending |
| Two-panel inbox layout | Simple, focused, faster to build | — Pending |

---
*Last updated: 2026-01-10 after initialization*
