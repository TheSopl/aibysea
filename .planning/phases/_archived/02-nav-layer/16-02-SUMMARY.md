---
phase: 16-nav-layer
plan: 02
status: complete
started: 2026-01-27
completed: 2026-01-27
---

# Summary: Drawer Integration & Layout

## What Was Built

Completed mobile navigation system with refined drawer and layout integration:

1. **MobileNav Drawer Restructured**
   - Converted from local useState to Zustand navigation store
   - Removed primary items (now in bottom nav): Dashboard, Inbox, Agents, Voice Agents
   - Secondary items only: Contacts, Call Logs, Phone Numbers, Documents (Upload/Processing/Data), Settings
   - Changed header from "AI BY SEA" to "More"
   - Added section headers: Conversational, Voice, Documents
   - Implemented swipe-to-close gesture with Framer Motion (drag="x", closes on >100px left drag or >500 velocity)

2. **Keyboard Detection**
   - Added visualViewport API listener in BottomNav
   - Bottom nav hides when keyboard opens (viewport < 80% of window height)
   - Bottom nav shows when keyboard closes
   - Uses navigation store's hideBottomNav/showBottomNav actions

3. **Layout Integration**
   - Main layout already had bottom padding from 16-01: `pb-[calc(56px+env(safe-area-inset-bottom,0px))] lg:pb-0`
   - Added CSS custom property: `--nav-height-bottom: 56px`

4. **Bonus: Mobile Page Fixes**
   - Voice-agents page: Responsive stats grid (2-col mobile), stacking layout, smaller elements
   - Settings page: Horizontal scrollable tabs on mobile, responsive forms, all 4 tabs mobile-friendly

## Key Decisions

1. **Drawer as "More" overflow** - Secondary navigation only, primary in bottom nav
2. **Swipe-to-close threshold** - 100px offset OR 500 velocity for responsive feel
3. **Keyboard detection via visualViewport** - Native API, no external dependencies
4. **0.8 threshold for keyboard** - Accounts for keyboards taking 40%+ of screen

## Files Changed

- `src/components/layout/MobileNav.tsx` - Restructured for secondary nav, added swipe gesture
- `src/components/layout/BottomNav.tsx` - Added keyboard detection
- `src/app/globals.css` - Added --nav-height-bottom CSS property
- `src/app/(main)/voice-agents/page.tsx` - Mobile responsive styling
- `src/app/(main)/settings/page.tsx` - Mobile responsive styling with horizontal tabs

## Commits

- `93c45f2` feat(16-02): restructure MobileNav drawer as secondary menu
- `7353e36` feat(16-02): add keyboard detection to hide bottom nav
- `0862d65` fix(voice-agents): improve mobile responsive styling
- `5195d83` fix(settings): improve mobile responsive styling

## Verification

- [x] Build passes without errors
- [x] Drawer uses navigation store (not local useState)
- [x] Drawer shows only secondary items
- [x] Swipe-to-close gesture works
- [x] Bottom nav hides during keyboard visibility
- [x] Layout has proper bottom padding
- [x] Mobile navigation flow complete

## What's Next

Phase 16: Navigation & Mobile UX is COMPLETE.

Ready for Phase 17: Core Pages - Responsive Overhaul (Inbox, Dashboard, AI Agents pages).
