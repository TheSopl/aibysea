# Phase 03: View Adaptation - Core Pages Responsive Overhaul

**Generated:** 2026-01-27
**Research Type:** Comprehensive, Production-Grade
**Quality Standard:** Bulletproof, Zero-Compromise

---

## Executive Summary

### Current State Audit

| Page | Desktop Status | Mobile Status | Critical Issues | Grade |
|------|----------------|---------------|-----------------|-------|
| Inbox | Working | Partially working | Message bubbles too wide, context panel overlay issues | C+ |
| Dashboard | Working | Good | Minor chart height issues | B+ |
| Agents | Working | Not optimized | Detail panel breaks on mobile | C |

### Critical Findings

**Inbox Page - Message Bubble Width Problem:**
```tsx
// CURRENT (BROKEN)
<div className="max-w-md">  // 448px - wider than iPhone 14 (390px)!

// REQUIRED FIX
<div className="max-w-[85%] xs:max-w-[280px] sm:max-w-xs tablet:max-w-sm lg:max-w-md">
```

**Inbox Page - Split View Pattern:**
- Current: `hidden md:flex` hides list when conversation selected
- Problem: md breakpoint is 428px (large phones), should be tablet (768px)
- Users on 500px screens see broken intermediate state

**Agents Page - Fixed Width Panel:**
```tsx
// CURRENT (BROKEN)
<div className="w-96">  // 384px fixed - breaks on mobile

// REQUIRED
<div className="fixed inset-0 tablet:relative tablet:w-96">
```

---

## Non-Negotiable Objectives

### What Success Looks Like

1. **Inbox fully functional on iPhone SE (320px)** - All messages readable, all controls accessible
2. **Master-detail pattern works seamlessly** - Smooth transitions, preserved scroll positions
3. **Dashboard metrics visible without scroll** - Key stats above fold on mobile
4. **Agents manageable on mobile** - List, view, edit without desktop
5. **No horizontal overflow anywhere** - Verified on all breakpoints
6. **Touch targets compliant** - All interactive elements 44px minimum
7. **Keyboard doesn't break layout** - Input fields remain visible

### Measurable Acceptance Criteria

| Page | Metric | Target | Verification |
|------|--------|--------|--------------|
| Inbox | Message bubble max width | 85% viewport on xs | Visual inspection |
| Inbox | Conversation list touch target | 48px height | DevTools |
| Inbox | Back navigation | Works on all phones | Manual test |
| Dashboard | Service cards | Stacked 1-col on mobile | Visual |
| Dashboard | Quick stats | 2-col on mobile, no overflow | Visual |
| Agents | Detail panel | Full screen on mobile | Manual test |
| All | Horizontal scroll | None | Chrome DevTools |
| All | Lighthouse Mobile | > 85 Accessibility | Lighthouse |

---

## Hard Boundaries

### Included (In Scope)

1. **Inbox Page Responsive Overhaul**
   - Master-detail navigation pattern
   - Message bubble width fix
   - Context panel mobile slide-in
   - Keyboard-aware input
   - Back button integration
   - Scroll position preservation

2. **Dashboard Page Verification & Fixes**
   - Grid layouts verification
   - Chart responsive heights
   - Activity feed mobile optimization
   - Quick stats 2-column mobile

3. **Agents Page Responsive**
   - List view mobile layout
   - Detail panel full-screen on mobile
   - Form modal mobile optimization
   - Delete confirmation mobile sizing

### Explicitly Excluded (Out of Scope)

| Item | Reason | Deferred To |
|------|--------|-------------|
| Voice Agents pages | Secondary page | Phase 04 |
| Document pages | Secondary page | Phase 04 |
| Settings page | Secondary page | Phase 04 |
| Contacts page | Secondary page | Phase 04 |
| New features | Scope creep | v5.0 |
| Virtual scrolling | Performance concern | Phase 05 |
| Offline support | Different concern | v5.0 |

---

## Best-Practice Approach

### 1. Inbox Master-Detail Pattern

**Current Problem:**
```
Mobile (320-767px): List OR Chat - abrupt switch
Tablet+ (768px+): List AND Chat side by side
```

**Solution Architecture:**

```
┌─────────────────────────────────────────────────┐
│              MOBILE (xs-md)                     │
├─────────────────────────────────────────────────┤
│ STATE: No conversation selected                 │
│ ┌─────────────────────────────────────────────┐│
│ │         CONVERSATION LIST                   ││
│ │         (full width)                        ││
│ └─────────────────────────────────────────────┘│
├─────────────────────────────────────────────────┤
│ STATE: Conversation selected                    │
│ ┌─────────────────────────────────────────────┐│
│ │ [←] Chat Header                             ││
│ │─────────────────────────────────────────────││
│ │         CHAT VIEW                           ││
│ │         (full screen, slide from right)     ││
│ │─────────────────────────────────────────────││
│ │ [Message Input]                             ││
│ └─────────────────────────────────────────────┘│
│ Context: Slide-in from right (button trigger)  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              TABLET+ (768px+)                   │
├─────────────────────────────────────────────────┤
│ ┌──────────┬────────────────────┬────────────┐ │
│ │   LIST   │      CHAT VIEW     │  CONTEXT   │ │
│ │  (w-80)  │     (flex-1)       │   (w-80)   │ │
│ │          │                    │  (toggle)  │ │
│ └──────────┴────────────────────┴────────────┘ │
└─────────────────────────────────────────────────┘
```

**Implementation Pattern:**

```tsx
// InboxPage.tsx structure
export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // On mobile, selecting conversation triggers slide-in
  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    if (window.innerWidth < 768) {
      setShowMobileChat(true);
    }
  };

  // Back button returns to list on mobile
  const handleBack = () => {
    setShowMobileChat(false);
    // Don't clear selection - allows quick return
  };

  return (
    <div className="flex h-full">
      {/* List - hidden on mobile when chat open */}
      <div className={cn(
        "w-full tablet:w-80 flex-shrink-0",
        showMobileChat && "hidden tablet:flex"
      )}>
        <ConversationList onSelect={handleSelectConversation} />
      </div>

      {/* Chat - full screen on mobile */}
      <div className={cn(
        "flex-1",
        "fixed inset-0 tablet:relative tablet:inset-auto",
        "transform transition-transform duration-300",
        showMobileChat ? "translate-x-0" : "translate-x-full tablet:translate-x-0"
      )}>
        <ChatView
          conversation={selectedConversation}
          onBack={handleBack}
          showBackButton={true}  // Always show on tablet:hidden
        />
      </div>
    </div>
  );
}
```

### 2. Message Bubble Responsive Width

**Problem Analysis:**
- iPhone SE viewport: 320px
- iPhone 14 viewport: 390px
- Current max-w-md: 448px (28rem)
- Result: Bubbles wider than screen, horizontal scroll

**Fix:**

```tsx
// MessageBubble.tsx
<div className={cn(
  // Mobile first: max 85% of container
  "max-w-[85%]",
  // Small phones: cap at reasonable width
  "xs:max-w-[280px]",
  // Standard phones
  "sm:max-w-xs",  // 320px
  // Tablets
  "tablet:max-w-sm",  // 384px
  // Desktop
  "lg:max-w-md"  // 448px
)}>
```

**Visual Verification:**
```
320px screen:  [Message up to 272px]  ✓
375px screen:  [Message up to 280px]  ✓
428px screen:  [Message up to 320px]  ✓
768px screen:  [Message up to 384px]  ✓
1024px screen: [Message up to 448px]  ✓
```

### 3. Dashboard Grid Verification

**Current Analysis:**
```tsx
// Service cards - GOOD
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

// Quick stats - GOOD
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

// Activity feed - NEEDS VERIFICATION
<div className="max-h-48 md:max-h-64">  // May need mobile height adjustment

// Charts - POTENTIAL ISSUE
<ResponsiveContainer width="100%" height={200} className="md:!h-[300px]">
// The className override may not work reliably with ResponsiveContainer
```

**Chart Fix:**
```tsx
// Replace className override with proper responsive pattern
const chartHeight = useBreakpoint() === 'mobile' ? 180 :
                    useBreakpoint() === 'tablet' ? 240 : 300;

<ResponsiveContainer width="100%" height={chartHeight}>
```

Or simpler CSS approach:
```tsx
<div className="h-[180px] tablet:h-[240px] lg:h-[300px]">
  <ResponsiveContainer width="100%" height="100%">
```

### 4. Agents Page Mobile Pattern

**Current Issues:**
- Agent list shows alongside detail panel
- Detail panel has `w-96` fixed width
- On small screens, detail panel overflows

**Solution:**

```tsx
// AgentsPage.tsx
<div className="flex h-full">
  {/* List - full width on mobile */}
  <div className={cn(
    "flex-1 tablet:flex-none tablet:w-80",
    selectedAgent && "hidden tablet:flex"
  )}>
    <AgentList onSelect={setSelectedAgent} />
  </div>

  {/* Detail - full screen overlay on mobile */}
  {selectedAgent && (
    <div className={cn(
      "fixed inset-0 z-40 bg-white dark:bg-slate-900",
      "tablet:relative tablet:inset-auto tablet:z-auto",
      "tablet:flex-1 tablet:border-l"
    )}>
      <AgentDetail
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />
    </div>
  )}
</div>
```

### 5. Keyboard Handling for Input

**Problem:** On mobile, keyboard covers message input

**Solution:**
```tsx
// MessageCompose.tsx
useEffect(() => {
  // Detect keyboard on iOS
  const handleResize = () => {
    if (window.visualViewport) {
      const viewportHeight = window.visualViewport.height;
      const windowHeight = window.innerHeight;

      if (windowHeight - viewportHeight > 150) {
        // Keyboard is open
        document.body.style.setProperty('--keyboard-height',
          `${windowHeight - viewportHeight}px`);
      } else {
        document.body.style.setProperty('--keyboard-height', '0px');
      }
    }
  };

  window.visualViewport?.addEventListener('resize', handleResize);
  return () => window.visualViewport?.removeEventListener('resize', handleResize);
}, []);
```

```css
/* Input container adjusts for keyboard */
.message-input-container {
  padding-bottom: calc(env(safe-area-inset-bottom) + var(--keyboard-height, 0px));
}
```

---

## Edge Cases & Failure Modes

### Critical Edge Cases

| Edge Case | Risk | Failure Mode | Mitigation |
|-----------|------|--------------|------------|
| Long conversation list (100+) | HIGH | Scroll jank | Consider virtualization marker |
| Long message thread (500+) | HIGH | Memory issues | Paginate or virtualize |
| Very long message text | MEDIUM | Layout break | word-break: break-word |
| Image messages | MEDIUM | Layout shift | Aspect ratio containers |
| Offline message send | MEDIUM | Lost message | Queue with indicator |
| Network timeout | MEDIUM | Stuck state | Timeout + retry UI |
| Very long agent name | LOW | Text overflow | truncate with title |
| Empty conversation list | LOW | Confusing state | Empty state design |

### Stress Test Scenarios

1. **Rapid conversation switching**: Select 10 conversations in 5 seconds
2. **Long thread scroll**: 500+ messages, scroll to top and back
3. **Orientation change**: Rotate while typing message
4. **Background/foreground**: Minimize app, return after 5 minutes
5. **Network loss**: Disable network, try to send message

---

## Implementation Order & Dependencies

### Dependency Graph

```
Phase 02 (Navigation) - required for back button
    │
    ▼
┌──────────────────────────────────────┐
│ Step 1: Message Bubble Fix           │
│ - Update max-width classes           │
│ - Test on all breakpoints            │
│ - No other dependencies              │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 2: Inbox Master-Detail          │
│ - Implement slide-in pattern         │
│ - Add back button                    │
│ - Preserve scroll positions          │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 3: Context Panel Mobile         │
│ - Full-screen overlay on mobile      │
│ - Slide-in animation                 │
│ - Close button                       │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 4: Dashboard Verification       │
│ - Test all grids                     │
│ - Fix chart heights                  │
│ - Verify activity feed               │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 5: Agents Page Mobile           │
│ - Full-screen detail overlay         │
│ - Modal form optimization            │
│ - Touch targets audit                │
└──────────────────────────────────────┘
```

### Files to Modify

| File | Changes | Priority |
|------|---------|----------|
| `src/components/MessageBubble.tsx` | Fix max-width | P0 |
| `src/app/(main)/inbox/page.tsx` | Master-detail pattern | P0 |
| `src/components/ConversationList.tsx` | Touch targets | P1 |
| `src/components/MessageCompose.tsx` | Keyboard handling | P1 |
| `src/app/(main)/dashboard/page.tsx` | Chart heights, verification | P1 |
| `src/app/(main)/agents/page.tsx` | Mobile detail overlay | P1 |
| `src/components/agents/AgentFormModal.tsx` | Mobile sizing | P2 |

---

## Cross-Phase Consistency

### Pattern Alignment with Phase 02

| Pattern | Phase 02 (Nav) | Phase 03 (Views) |
|---------|----------------|------------------|
| Slide-in transition | Drawer: 300ms ease | Chat: 300ms ease |
| Full-screen overlay | z-50 | z-40 (below nav) |
| Back button | Hardware handled | Software button |
| Safe area | Bottom nav respects | Input respects |

### Shared Components to Create

```
src/components/ui/
├── ResponsivePanel.tsx      # Reusable slide-in panel
├── MobileOverlay.tsx        # Full-screen mobile container
└── BackButton.tsx           # Consistent back navigation
```

### Design Token Usage

| Token | Usage in Phase 03 |
|-------|-------------------|
| `--spacing-page-x` | Page padding |
| `--spacing-card` | Card/panel padding |
| `tablet:` breakpoint | Split view threshold |
| `.touch-target` | All list items, buttons |

---

## Testing Protocol

### Device Matrix

| Device | Priority | Critical Tests |
|--------|----------|---------------|
| iPhone SE (320px) | P0 | Message width, list scroll |
| iPhone 14 (390px) | P0 | Full flow test |
| iPhone 14 Pro Max (430px) | P0 | Orientation change |
| iPad Mini (768px) | P0 | Split view threshold |
| Pixel 7 (412px) | P1 | Android keyboard |

### Page-Specific Tests

**Inbox:**
1. Open app → see conversation list
2. Tap conversation → full-screen chat
3. Send message → appears correctly
4. Tap back → return to list
5. Rotate → layout adapts
6. Tap info → context slides in
7. Close context → returns to chat

**Dashboard:**
1. All cards visible on mobile
2. Charts render correctly
3. No horizontal scroll
4. Activity feed scrollable
5. Quick stats 2-column

**Agents:**
1. Agent list shows
2. Tap agent → full-screen detail
3. Edit agent → modal works
4. Delete → confirmation modal works
5. Back → returns to list

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Animation conflicts with nav | Medium | Medium | Coordinate z-index |
| Scroll position lost | High | Medium | Implement preservation |
| Keyboard covers input | High | High | VisualViewport API |
| Chart resize issues | Medium | Low | Use container sizing |
| Breaking existing tablet | Medium | High | Regression testing |

---

## Success Metrics

After Phase 03 completion:

| Page | Metric | Current | Target |
|------|--------|---------|--------|
| Inbox | Usable on 320px | Partial | 100% |
| Inbox | Message send success | Unknown | > 99% |
| Dashboard | Above-fold content | Unknown | Key metrics visible |
| Agents | Mobile management | Broken | Fully functional |
| All | Horizontal overflow | Present | None |
| All | Touch target violations | Unknown | 0 |

---

## Sources & References

- [React Router: Responsive Master-Detail](https://github.com/remix-run/react-router/discussions/11092)
- [Responsive Master-Detail Layout in React](https://neekey.net/2017/01/23/responsive-master-detail-layout-in-react/)
- [VisualViewport API](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- [CSS word-break](https://developer.mozilla.org/en-US/docs/Web/CSS/word-break)
- [Recharts ResponsiveContainer](https://recharts.org/en-US/api/ResponsiveContainer)
