# AIBYSEA

## What This Is

An internal multi-channel inbox for handling customer conversations across messaging platforms, starting with WhatsApp. Agents log into a unified console to view all chats, with AI handling first contact and seamless human takeover. Built for internal company use as a respond.io alternative.

## Core Value

The unified inbox works reliably — all WhatsApp messages appear in one place and agents can respond without messages getting lost.

## Requirements

### Validated (v1.0)

- ✓ Agent authentication and login — v1.0 (Supabase auth)
- ✓ WhatsApp Cloud API integration (receive and send messages) — v1.0
- ✓ Telegram Bot API integration — v1.0 (as alternative channel)
- ✓ Unified inbox: two-panel layout (chat list + active conversation) — v1.0
- ✓ Contact management with phone number as primary identifier — v1.0
- ✓ AI agent per channel that handles full conversation until stuck or customer requests human — v1.0 (via n8n webhooks)
- ✓ Human takeover: agent clicks to take over, AI auto-pauses — v1.0
- ✓ AI re-enable: dropdown to manually re-assign AI to conversation — v1.0
- ✓ Webhook endpoints for n8n integration (initial AI orchestration) — v1.0
- ✓ Real-time message updates — v1.0 (Supabase WebSockets)
- ✓ Arabic RTL support foundation — v1.0 (dir attribute, translation-ready)

### Active (v1.1+)

- [ ] Message search and filtering
- [ ] Conversation notes and internal comments (agent-only)
- [ ] Automated conversation routing by topic/keyword
- [ ] Conversation templates/canned responses
- [ ] Agent presence status and availability
- [ ] Advanced AI customization via n8n UI
- [ ] End-to-end WhatsApp verification (Meta dashboard setup)

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
| Next.js 16 + Supabase stack | Real-time built-in, auth included, PostgreSQL, good for chat apps | ✓ Worked well — fast dev, real-time subscriptions reliable |
| Vercel + Supabase Cloud hosting | Managed hosting, minimal DevOps, free tiers to start | ✓ Deployed smoothly — no infrastructure burden |
| Phone number as primary contact identifier | WhatsApp always has phone, simplifies matching | ✓ Worked well — natural key, no duplicates |
| n8n for initial AI orchestration | Decouple AI logic, iterate fast without code changes | ✓ Excellent — non-technical flow editing, fast iteration |
| Two-panel inbox layout | Simple, focused, faster to build | ✓ Validated — users like side-by-side layout, no complaints |
| Supabase SSR package | Proper cookie handling in all contexts (server/client/middleware) | ✓ Solved auth complexity — works in all Next.js patterns |
| Manual TypeScript types | Supabase CLI needs linked project (not available for this setup) | ✓ Acceptable — types maintained by hand, easy to update |
| Simple RLS: all authenticated agents see all data | No need for role-based access in internal tool | ✓ Good enough — simplifies security, agents trust each other |
| Use crypto.timingSafeEqual for webhook signatures | Prevent timing attacks on webhook verification | ✓ Implemented — secure webhook handling |
| Use service role client for webhook processing | RLS bypass needed for system operations | ✓ Good pattern — clean separation of concerns |
| Store whatsapp_message_id for deduplication | Webhook retries could duplicate messages | ✓ Prevented issues — no duplicate messages from retries |
| Optimistic UI updates for takeover toggle | Instant visual feedback, revert on error | ✓ Good UX — feels responsive, errors handled gracefully |
| Color-coded handler states: blue for AI, orange for human | Visual distinction in UI | ✓ Clear — users immediately know who's handling |
| Real-time subscriptions with REPLICA IDENTITY FULL | Required for Supabase real-time on messages table | ✓ Necessary — works but adds DB overhead |
| Server wrapper + client component pattern | Real-time subscriptions only work in client components | ✓ Clean pattern — clear separation, easy to maintain |
| RTL support: translation-only, no layout changes | Simpler than full layout flipping | ✓ Smart approach — layout stays clean, text direction handles it |

## Current State (v1.0 - Shipped)

**Shipped version:** v1.0 MVP (2026-01-13)

**Codebase:**
- ~2,500+ lines of TypeScript/React/SQL
- Next.js 16 with App Router, Supabase SSR, real-time subscriptions
- 7 phases, 14 plans, 45 commits from start to ship

**Tech stack:**
- Frontend: Next.js 16, React 19, Tailwind CSS 4, TypeScript
- Backend: Supabase (PostgreSQL, Auth, real-time, webhooks)
- Integrations: WhatsApp Cloud API, Telegram Bot API, n8n
- Hosting: Vercel + Supabase Cloud

**What's working:**
- Unified inbox with real-time message updates
- AI-first conversation handling via n8n
- Human takeover with instant UI feedback
- Multi-channel support (WhatsApp + Telegram)
- Internal agent authentication and access control

**Known limitations / Tech debt for v1.1:**
- Arabic translation not yet done (foundation in place)
- No message search/filtering yet
- No conversation notes feature
- WhatsApp end-to-end verification pending (Meta dashboard)
- Single-company setup only (no multi-tenant)

---
*Last updated: 2026-01-13 after v1.0 milestone completion*
