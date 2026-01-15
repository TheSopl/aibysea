# AI BY SEA - Multi-Service AI Platform

## What This Is

A comprehensive SaaS platform that sells three premium AI services to businesses:
1. **Conversational AI** - Multi-channel customer support automation (WhatsApp, Telegram, Facebook, Instagram)
2. **Voice Agents** - AI that makes and receives phone calls for appointments, support, and sales
3. **Document Intelligence** - AI-powered document processing and data extraction

Single unified platform where customers can access all three services from one dashboard.

## Core Value

Businesses can access enterprise-grade AI automation across conversational, voice, and document channels—all integrated into one platform, eliminating the need for multiple separate tools.

## Requirements

### Phase 1: UI/UX Restructuring (Current)
- [ ] Unified dashboard showing all 3 services
- [ ] Updated sidebar navigation with service modules
- [ ] Service-specific color coding (accent for conversational, teal for voice, orange for documents)
- [ ] Unified analytics and contacts across all services

### Phase 2: Voice Agents UI
- [ ] Voice agents list and management
- [ ] Call logs and transcription viewer
- [ ] Phone number management
- [ ] Voice settings and configuration

### Phase 3: Document Intelligence UI
- [ ] Drag-and-drop document upload
- [ ] Processing queue visualization
- [ ] Extracted data viewer and editor
- [ ] Template builder for custom extractions

### Phase 4: Backend Infrastructure
- [ ] API routes for new services
- [ ] Mock data for demo purposes
- [ ] Database schema extensions

### Future Enhancements (v2.0+)

- Voice agent integration with ElevenLabs/PlayHT
- Document processing with GPT-4 Vision
- Real-time voice call handling with Twilio
- SDR outbound prospecting automation
- Advanced analytics and reporting
- Multi-tenant customer support
- Billing and usage tracking

## Context

**Background:**
- AI BY SEA is pivoting from internal tool to SaaS platform
- Market opportunity: businesses willing to pay $5K-50K/month per service
- Current conversational AI platform (v1.0) is solid foundation
- Expanding to voice and document services to capture more revenue

**Business Model:**
- Sell 3 AI services: Conversational ($2-5K/month), Voice ($3-15K/month), Documents ($5-25K/month)
- Bundle pricing: $8-30K/month depending on package
- Target: SMBs and enterprises needing AI automation across multiple channels

**Technical Environment:**
- Conversational AI fully functional (WhatsApp, Telegram, n8n integration)
- Voice: Will integrate ElevenLabs, PlayHT, Twilio, Bland.ai
- Documents: Will use GPT-4 Vision, custom templates, exports to CRM
- Shared: Supabase backend, unified dashboard, shared contacts database

**User Workflow:**
1. Business signs up, selects services (chat, voice, documents)
2. Connect channels/integrations in settings
3. Create AI agents/workflows for each service
4. Monitor unified dashboard for all activities
5. Analytics show ROI across all services

## Constraints

- **Timeline**: 4-6 weeks to expand UI and backend for 3 services
- **Tech Stack**: Next.js + Supabase (existing, no changes)
- **Hosting**: Vercel + Supabase Cloud (existing, no changes)
- **Design**: Match existing Purity UI SaaS aesthetic with service-specific color coding
- **Backend**: Mock data for demo, real integrations in v2.0
- **Development**: Claude Code + GSD, rapid iteration cycles

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

## Current State (v1.0 Complete → v2.0 Expansion)

**Shipped v1.0:** Conversational AI platform (2026-01-13)

**Current Focus:** Expanding to multi-service SaaS platform

**Codebase:**
- ~2,500+ lines of TypeScript/React (v1.0 conversational AI complete)
- Next.js 16 with App Router, Supabase SSR, real-time subscriptions
- Architecture proven, now scaling to add 2 new service modules

**What's Complete (v1.0):**
- ✅ Conversational AI with unified inbox
- ✅ Multi-channel support (WhatsApp + Telegram)
- ✅ Real-time message updates
- ✅ AI/human takeover system
- ✅ n8n webhook integration
- ✅ Supabase authentication and database

**What's Next (v2.0):**
- 🚀 Voice Agents module (this phase)
- 🚀 Document Intelligence module (this phase)
- 🚀 Unified dashboard (this phase)
- 🚀 Service navigation restructure (this phase)
- 🚀 Backend API routes and mock data (this phase)

**Design System (Established):**
- Purity UI SaaS aesthetic (gradients, animations, smooth transitions)
- Sidebar navigation with icon-based menu
- Color system: Blues/purples for primary, accent gradient established
- Ready to extend with new service colors (teal for voice, orange for documents)

---
*Last updated: 2026-01-16 — Expanded scope to multi-service platform*
