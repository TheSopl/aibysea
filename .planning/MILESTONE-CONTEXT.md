# Milestone Context: v1.1 AI Cockpit

**Generated:** 2026-01-13
**Status:** Ready for /gsd:new-milestone
**Based on:** User vision discussion

## Vision

Transform from a basic messaging tool into a **futuristic AI support cockpit** — giving agents complete visibility into AI thinking, fine-grained control over responses, and real-time metrics on conversation handling.

## Features to Build

### Intelligence & Awareness
- **AI Cognitive HUD** — Show what AI sees in every message: intent, entities, sentiment, urgency level, VIP flag, confidence score
- **Enhanced Typing Telemetry** — Thinking animation + latency display (show AI is reasoning)
- **Timeline Annotations** — Policy violations, 24h window expiry, escalation reasons, deadlines

### Human Control & Intervention
- **Hybrid AI ↔ Human Control (Co-pilot Mode)** — AI suggests next action, human approves before sending (not just takeover, but intelligent collaboration)
- **Improved Takeover + Resume** — Better handoff experience with context preservation
- **Command Palette (Ctrl+K)** — Quick access to inbox actions and navigation

### Insights & Metrics
- **Live AI Metrics Strip** — Real-time display: uptime, latency, deflection rate, escalations
- **Lead Qualification Tags** — Browsing / Qualified / Negotiating / Booking states
- **Visual AI Memory** — Show what AI knows: customer preferences, past bookings, price sensitivity

### Context & Suggestions
- **Multi-strategy AI Suggestions** — Show 3 response paths: Safe (no risk) / Direct (efficient) / Upsell (opportunity)
- **Agent Bridge Mode** — AI summaries for human context switching (quick briefing when taking over)

## Scope

**Suggested name:** v1.1 AI Cockpit
**Estimated phases:** 3 phases
**Focus:** Turn the unified inbox into an intelligent support command center with real-time AI reasoning visibility and fine-grained human control.

## Phase Mapping

### Phase 7: AI Cognitive HUD + Hybrid Control
**Goal:** Show AI reasoning and enable co-pilot mode (suggest, then human approves)
- AI Cognitive HUD implementation (intent, entities, sentiment, urgency, VIP, confidence display)
- Co-pilot mode UI (suggestion cards with approve/edit/reject actions)
- Enhanced typing telemetry (thinking animation, latency display)
- Command Palette (Ctrl+K navigation)

### Phase 8: Metrics & Timeline Intelligence
**Goal:** Real-time performance insights and conversation annotations
- Live AI Metrics Strip (uptime, latency, deflection, escalations)
- Timeline Annotations (policy violations, 24h windows, escalation reasons, deadlines)
- Conversation history enhancements with timeline context

### Phase 9: Memory & Qualification
**Goal:** Long-term AI learning and conversation context
- Lead Qualification Tags (browsing / qualified / negotiating / booking)
- Visual AI Memory (preferences, booking history, price sensitivity)
- Agent Bridge Mode (context summaries for takeover handoff)
- Multi-strategy AI Suggestions (safe / direct / upsell paths)

## Implementation Notes

**n8n Integration:** New AI features (co-pilot suggestions, strategy selection, memory updates) will likely expand n8n workflows. Flexible, can iterate.

**Database Schema:** New tables/columns needed for:
- Conversation annotations (timeline events)
- AI metrics (latency, deflection, escalations)
- Lead qualification state
- Customer memory (preferences, bookings, sensitivity)

**UI Paradigm Shift:** From "read-only visibility" → "read + suggest + control" model. Significant UX work.

**Architecture:** Likely need:
- Real-time metrics aggregation
- AI suggestion pipeline (generate multiple strategies)
- Context-aware summaries for agent bridge
- Timeline event system

## Questions for Discovery Phase

- How detailed should the Cognitive HUD be? (All fields at once, or progressive disclosure?)
- For co-pilot mode, what's the approval UX? (Buttons, keyboard shortcuts, drag-to-send?)
- Should metrics be per-conversation or per-agent? (Both?)
- For AI memory, what's the retention policy? (All history or summarized?)

---

*This file is temporary. It will be deleted after /gsd:new-milestone creates the milestone.*
