# Phase 02: Navigation Layer - Deep Research & Specification

**Generated:** 2026-01-27
**Research Type:** Comprehensive, Production-Grade
**Quality Standard:** Bulletproof, Zero-Compromise

---

## Executive Summary

### Current State Audit

| Component | Current Implementation | Mobile Status | Grade |
|-----------|----------------------|---------------|-------|
| Desktop Sidebar | `hidden lg:flex`, 80px icon-only | Working | A |
| Mobile Header | Fixed 64px, hamburger + logo + avatar | Working | B+ |
| Mobile Drawer | Slide-in w-72, route-close | Working | B |
| Bottom Navigation | **NOT IMPLEMENTED** | Critical Gap | F |
| Navigation State | useState in MobileNav | Isolated | C |
| Route Highlighting | pathname.startsWith() | Working | B+ |
| Module Expansion | Accordion pattern | Working | B |

### Critical Finding: Bottom Navigation Imperative

**Research Evidence:**
- Nielsen Norman Group: Hidden navigation (hamburger) shows 20%+ drop in content discoverability vs visible navigation
- 2025 UX Studies: Bottom tab bars increase user engagement by up to 58%
- 79% of users abandon applications difficult to navigate
- Zeebox case study: Engagement halved after switching to hamburger menu

**Conclusion:** The current hamburger-only mobile navigation is a significant UX bottleneck. Bottom navigation is mandatory for production-grade mobile experience.

---

## Non-Negotiable Objectives

### What Success Looks Like

1. **Primary actions reachable in one tap** - Dashboard, Inbox, Agents visible without opening any menu
2. **Thumb-zone optimized** - All primary navigation within bottom 30% of screen
3. **Zero navigation friction** - No thinking required to find core features
4. **Instant feedback** - Active states clearly visible (4.5:1+ contrast ratio)
5. **Seamless transitions** - Route changes under 300ms, no jank
6. **Accessible** - Full keyboard/screen reader navigation support
7. **Consistent with platform conventions** - iOS/Android users feel at home

### Measurable Acceptance Criteria

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Tap-to-content time | < 500ms | Manual testing |
| Navigation discovery rate | > 95% | Usability testing |
| Animation frame rate | 60fps | Chrome DevTools |
| WCAG AA compliance | 100% | aXe audit |
| Lighthouse Accessibility | > 95 | Lighthouse |
| Hardware back button | Works | Android testing |
| VoiceOver navigation | Complete | iOS testing |

---

## Hard Boundaries

### Included (In Scope)

1. **Bottom Navigation Bar**
   - 4 primary items + "More" overflow
   - 56px height + safe-area-inset-bottom
   - Active state indicators
   - Badge support for notifications

2. **Hamburger Drawer Refinement**
   - Move secondary items to drawer
   - Improve animation smoothness
   - Add swipe-to-close gesture

3. **Mobile Header Optimization**
   - Safe area handling for Dynamic Island
   - Consistent height across pages
   - Breadcrumb support for deep navigation

4. **Navigation State Management**
   - Centralized navigation context
   - Scroll position preservation
   - Back button behavior standardization

5. **Transition System**
   - Route change animations
   - Drawer enter/exit animations
   - Bottom nav indicator animations

### Explicitly Excluded (Out of Scope)

| Item | Reason | Deferred To |
|------|--------|-------------|
| Page content layouts | Different concern | Phase 03-04 |
| Search redesign | Separate feature | v5.0 |
| User profile page | Content, not nav | Phase 04 |
| Command palette mobile | Complex feature | v5.0 |
| Gesture navigation (full) | Scope creep | v5.0 |
| Notification center | New feature | v5.0 |

---

## Best-Practice Approach

### 1. Bottom Navigation Architecture

**Component Structure:**
```
BottomNav.tsx
├── BottomNavItem.tsx (individual tab)
├── BottomNavBadge.tsx (notification indicator)
└── BottomNavMore.tsx (overflow trigger)
```

**Tab Selection Rationale:**

| Position | Item | Justification |
|----------|------|---------------|
| 1 | Dashboard | Entry point, overview |
| 2 | Inbox | Highest frequency action |
| 3 | Agents | Core management feature |
| 4 | Voice | Second service (balanced) |
| 5 | More | Overflow pattern standard |

**Why Not Documents?** Voice has higher real-time urgency (calls) vs Documents (async processing). Voice users need faster access.

**Design Specifications (Non-Negotiable):**

```css
/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--nav-bg);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 50;
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  min-width: 64px; /* Touch target */
  gap: 2px;
}

.bottom-nav-icon {
  width: 24px;
  height: 24px;
}

.bottom-nav-label {
  font-size: 10px;
  font-weight: 600;
}
```

### 2. Drawer Overflow Pattern

**Items to Move to "More" Drawer:**
- Contacts
- Call Logs
- Phone Numbers
- Documents (Upload, Processing, Data)
- Settings

**Drawer Structure:**
```
┌─────────────────────────────┐
│ [X]  More                   │
├─────────────────────────────┤
│ ─── CONVERSATIONAL ───      │
│ 👥 Contacts                 │
├─────────────────────────────┤
│ ─── VOICE ───               │
│ 📞 Call Logs                │
│ 📱 Phone Numbers            │
├─────────────────────────────┤
│ ─── DOCUMENTS ───           │
│ 📄 Upload                   │
│ ⚙️ Processing               │
│ 📊 Data                     │
├─────────────────────────────┤
│ ⚙️ Settings                 │
└─────────────────────────────┘
```

### 3. Navigation State Architecture

```typescript
// navigation-context.tsx
interface NavigationState {
  isDrawerOpen: boolean;
  activeRoute: string;
  previousRoute: string | null;
  scrollPositions: Map<string, number>;
  bottomNavVisible: boolean;
}

interface NavigationActions {
  openDrawer: () => void;
  closeDrawer: () => void;
  setActiveRoute: (route: string) => void;
  saveScrollPosition: (route: string, position: number) => void;
  restoreScrollPosition: (route: string) => number;
  hideBottomNav: () => void;
  showBottomNav: () => void;
}
```

**Why Zustand over Context?**
- Already in dependencies
- Better performance (no cascading re-renders)
- Simpler API
- DevTools support

### 4. Thumb Zone Optimization

```
┌─────────────────────────────┐
│         HARD TO REACH       │ ← NO navigation actions here
│           (top 20%)         │
│─────────────────────────────│
│                             │
│        CONTENT AREA         │
│                             │
│─────────────────────────────│
│      NATURAL REACH          │ ← Secondary actions OK
│         (middle)            │
│─────────────────────────────│
│     EASY REACH (THUMB)      │ ← ALL primary nav here
│   [🏠] [📥] [🤖] [📞] [≡]   │
└─────────────────────────────┘
```

### 5. Animation Specifications

| Animation | Duration | Easing | Notes |
|-----------|----------|--------|-------|
| Bottom nav indicator | 200ms | ease-out | Slide + scale |
| Drawer enter | 300ms | cubic-bezier(0.32, 0.72, 0, 1) | iOS standard |
| Drawer exit | 250ms | cubic-bezier(0.32, 0.72, 0, 1) | Slightly faster |
| Route fade | 150ms | ease-in-out | Subtle only |
| Active state | 150ms | ease-out | Icon scale |

**Why These Durations?**
- Under 300ms feels instant
- Over 400ms feels sluggish
- iOS standard animations set user expectations

---

## Edge Cases & Failure Modes

### Critical Edge Cases

| Edge Case | Risk Level | Failure Mode | Mitigation |
|-----------|------------|--------------|------------|
| Keyboard visible | HIGH | Bottom nav overlaps keyboard | Hide bottom nav when keyboard opens |
| 5+ tabs needed | MEDIUM | Overflow confusion | Strict 4+More pattern |
| Deep link to secondary route | MEDIUM | Bottom nav state wrong | Parse URL to set correct tab |
| Hardware back on Android | HIGH | App exits unexpectedly | Handle popstate, close drawer first |
| Rapid route switching | MEDIUM | Animation glitches | Debounce navigation |
| Offline state | LOW | Missing route data | Graceful degradation |
| RTL languages | LOW | Layout mirrors wrong | Test with dir="rtl" |
| Notch phones landscape | MEDIUM | Safe area overlap | Test env(safe-area-inset-*) |

### Stress Test Scenarios

1. **Rapid Navigation**: Tap all 5 tabs in 2 seconds - no crashes, no stale state
2. **Drawer + Route**: Open drawer, tap item, back button - drawer closes, previous page shows
3. **Orientation Change**: Rotate while drawer open - drawer stays open, layout adjusts
4. **Memory Pressure**: Open 20+ pages in sequence - no memory leak
5. **Slow Network**: 3G simulation - navigation still instant (local)

---

## Implementation Order & Dependencies

### Dependency Graph

```
Phase 15 (Foundation) ✅
    │
    ▼
┌──────────────────────────────────────┐
│ Step 1: Navigation State (Zustand)   │
│ - Create navigation store            │
│ - Migrate MobileNav state            │
│ - Add scroll position tracking       │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 2: Bottom Navigation Component  │
│ - Create BottomNav.tsx               │
│ - Implement 4+More pattern           │
│ - Add safe area handling             │
│ - Add active indicators              │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 3: Drawer Refinement            │
│ - Restructure for secondary items    │
│ - Add swipe gesture                  │
│ - Improve animations                 │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 4: Layout Integration           │
│ - Add bottom padding for nav         │
│ - Keyboard hide detection            │
│ - Route change handling              │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 5: Polish & Accessibility       │
│ - ARIA labels                        │
│ - Focus management                   │
│ - Animation refinement               │
└──────────────────────────────────────┘
```

### Files to Create/Modify

| File | Action | Priority |
|------|--------|----------|
| `src/stores/navigation.ts` | CREATE | P0 |
| `src/components/layout/BottomNav.tsx` | CREATE | P0 |
| `src/components/layout/BottomNavItem.tsx` | CREATE | P0 |
| `src/components/layout/MobileNav.tsx` | MODIFY | P0 |
| `src/app/(main)/layout.tsx` | MODIFY | P0 |
| `src/components/layout/TopBar.tsx` | MODIFY | P1 |
| `src/app/globals.css` | MODIFY | P1 |

---

## Cross-Phase Consistency

### Design Token Alignment

| Token | Value | Used In |
|-------|-------|---------|
| `--nav-height-bottom` | 56px | Bottom nav, page padding |
| `--nav-height-top` | 64px | Top bar, content offset |
| `--nav-transition` | 300ms cubic-bezier(0.32, 0.72, 0, 1) | All nav animations |
| `--nav-active-bg` | gradient(primary, accent) | Active indicators |
| `--nav-z-index` | 50 | Stacking context |

### Naming Conventions

| Pattern | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `BottomNav.tsx` |
| Store | camelCase | `useNavigationStore` |
| CSS classes | kebab-case | `.bottom-nav-item` |
| Actions | verbNoun | `openDrawer`, `closeDrawer` |

### Accessibility Requirements (WCAG 2.2)

| Criterion | Requirement | Implementation |
|-----------|-------------|----------------|
| 2.4.1 Bypass Blocks | Skip to content | Skip link on mobile |
| 2.4.3 Focus Order | Logical sequence | Tab order matches visual |
| 2.5.8 Target Size | 24px minimum | 64px touch targets |
| 1.4.3 Contrast | 4.5:1 text | Dark/light mode tested |
| 4.1.2 Name, Role, Value | ARIA labels | All interactive elements |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Bottom nav feels cramped | Medium | High | Test with real users, iterate |
| Animation jank | Low | Medium | requestAnimationFrame, will-change |
| State desync | Medium | High | Single source of truth (Zustand) |
| iOS safe area issues | Medium | Medium | Test on real devices |
| Android back button | High | High | Event listener on mount |
| Breaking existing layout | Medium | High | Feature flag for rollout |

---

## Testing Protocol

### Device Matrix

| Device | OS | Screen | Priority |
|--------|----|---------|---------|
| iPhone SE | iOS 17 | 375×667 | P0 |
| iPhone 14 | iOS 17 | 390×844 | P0 |
| iPhone 14 Pro Max | iOS 17 | 430×932 | P0 |
| Pixel 7 | Android 14 | 412×915 | P0 |
| Samsung S23 | Android 14 | 360×800 | P1 |
| iPad Mini | iPadOS 17 | 744×1133 | P1 |

### Test Scenarios

1. **Happy Path**: Open app → tap each bottom nav item → verify correct page loads
2. **More Drawer**: Tap More → tap secondary item → verify drawer closes, page loads
3. **Back Button**: Navigate 3 levels deep → press back → verify correct return
4. **Orientation**: Rotate device → verify nav adapts
5. **Keyboard**: Open message input → verify bottom nav hides
6. **Accessibility**: Enable VoiceOver → navigate entire app using screen reader

---

## Sources & References

- [Nielsen Norman Group: Hamburger Menus Hurt UX Metrics](https://www.nngroup.com/articles/hamburger-menus/)
- [NN/g: Basic Patterns for Mobile Navigation](https://www.nngroup.com/articles/mobile-navigation-patterns/)
- [WCAG 2.5.8 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Apple Human Interface Guidelines: Tab Bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Material Design: Navigation Bar](https://m3.material.io/components/navigation-bar/overview)
- [CSS env() Safe Area Insets](https://developer.mozilla.org/en-US/docs/Web/CSS/env)

---

## Success Metrics

After Phase 02 completion:

| Metric | Baseline | Target |
|--------|----------|--------|
| Navigation tap count to Inbox | 2 (menu + item) | 1 |
| Time to find Settings | ~5s | ~2s |
| Navigation error rate | Unknown | < 3% |
| Accessibility violations | Unknown | 0 |
| Animation smoothness | Unknown | 60fps |
