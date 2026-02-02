# Phase 21: UI Design System Enforcement — Context

**Goal:** Create unified Button and Card components, enforce Tailwind design tokens across all pages, eliminate spacing/typography/color inconsistencies, and add smooth, professional animations throughout the platform.

**Source:** [codebase/CONCERNS.md](../../codebase/CONCERNS.md) — UI Consistency Issues (lines 5-62) + User requirement for modern animations

---

## 🎨 Critical Issues to Fix

### 1. Inconsistent Spacing Patterns
**Current State:**
- Multiple spacing scales used inconsistently: `px-3`, `px-4`, `px-6`, `p-4`, `p-6` mixed throughout
- Design tokens exist in `tailwind.config.js` but not enforced
- Custom padding patterns in components

**From CONCERNS.md:**
```
### Inconsistent Spacing Patterns
- Issue: Multiple spacing scales used inconsistently across components
- Files:
  - src/components/layout/Sidebar.tsx - Custom padding patterns
  - src/components/ui/ResponsiveContainer.tsx - px-4 sm:px-5 tablet:px-6 lg:px-8
  - Multiple pages use different spacing (px-3, px-4, px-6, p-4, p-6 mixed)
- Impact: UI looks "off" - inconsistent margins/padding across pages
```

**Design tokens available (from tailwind.config.js):**
- `page`: Base page padding
- `page-sm`, `page-md`, `page-lg`: Responsive page padding
- `section`: Section spacing
- `card`, `card-md`, `card-lg`: Card padding variants

**Fix approach:**
1. Audit all components for spacing usage
2. Replace custom `px-*` with design tokens
3. Create spacing guide document
4. Add ESLint rule to enforce tokens (optional)

---

### 2. Typography Scale Not Fully Applied
**Current State:**
- Mix of custom text sizes (`text-3xl`, `text-2xl`, `text-xl`) and design tokens
- Design system added in Phase 15 but not retrofitted
- Inconsistent text hierarchy

**From CONCERNS.md:**
```
### Typography Scale Not Fully Applied
- Issue: Mix of custom text sizes and design system tokens
- Files: All page files in src/app/[locale]/(main)/**/*.tsx
- Impact: Inconsistent text hierarchy, some headings too large/small
- Fix approach:
  - Replace: text-3xl, text-2xl, text-xl → heading-1, heading-2, heading-3 tokens
  - Apply responsive variants: heading-1-sm, heading-1-md, heading-1-lg
  - Enforce via ESLint rule (ban custom text-* in favor of tokens)
```

**Typography tokens available:**
- `heading-1`, `heading-2`, `heading-3`: Base heading sizes
- `heading-1-sm`, `heading-1-md`, `heading-1-lg`: Responsive variants
- Body text scales defined in design system

---

### 3. Button Style Variations
**Current State:**
- **No unified Button component** — buttons defined inline throughout app
- 15+ different button styles across pages
- Inconsistent padding, hover states, sizes

**From CONCERNS.md:**
```
### Button Style Variations
- Issue: No unified button component - buttons defined inline with varying styles
- Files: Throughout src/components/ and src/app/[locale]/ (no central Button.tsx)
- Impact: Buttons look different across pages (sizes, padding, hover states)
- Fix approach:
  - Create src/components/ui/Button.tsx with variants (primary, secondary, ghost, danger)
  - Define sizes (sm, md, lg) with consistent padding and min-height
  - Ensure 44px min touch target (mobile accessibility)
  - Replace all inline button definitions
```

**Required variants:**
- `primary`: Main action (blue/purple accent)
- `secondary`: Secondary action (gray)
- `ghost`: Tertiary action (transparent with hover)
- `danger`: Destructive action (red)

**Required sizes:**
- `sm`: Compact (32px height)
- `md`: Default (44px height — mobile touch target)
- `lg`: Large (56px height)

---

### 4. Color Usage Inconsistencies
**Current State:**
- Direct color values (`text-blue-500`, `bg-purple-600`) mixed with design tokens
- Service color coding (teal for Voice, orange for Documents) not consistently applied

**From CONCERNS.md:**
```
### Color Usage Inconsistencies
- Issue: Direct color values mixed with design tokens
- Files: Multiple components use text-blue-500, bg-purple-600 instead of primary/accent tokens
- Impact: Service color coding (voice=teal, docs=orange) not consistently applied
- Fix approach:
  - Replace: bg-blue-* → bg-primary-*
  - Replace: bg-teal-* → bg-accent-* (for conversational service)
  - Apply service colors: service-voice-*, service-documents-* for their respective modules
  - Create ESLint rule to warn on direct color values
```

**Color tokens available:**
- `primary-*`: Main brand color (blue/purple)
- `accent-*`: Accent color (teal for conversational)
- `service-voice-*`: Voice module color (teal)
- `service-documents-*`: Documents module color (orange)

---

### 5. Card Component Variations
**Current State:**
- Multiple card patterns with different shadows, borders, border-radii
- Dashboard cards, conversation cards, agent cards all use different styles
- No base Card component

**From CONCERNS.md:**
```
### Card Component Variations
- Issue: Multiple card patterns with different shadows, borders, radii
- Files: Dashboard cards, conversation cards, agent cards all use different styles
- Impact: Inconsistent card UI throughout app
- Fix approach:
  - Create src/components/ui/Card.tsx with consistent shadow-card, rounded-design-lg
  - Use hover:shadow-card-hover for interactive cards
  - Standardize card padding to card, card-md, card-lg tokens
```

**Required structure:**
```tsx
<Card>
  <Card.Header>...</Card.Header>
  <Card.Content>...</Card.Content>
  <Card.Footer>...</Card.Footer>
</Card>
```

**Variants:**
- Default: Standard card with shadow
- Interactive: Hover effect for clickable cards
- Flat: No shadow (for nested cards)

---

### 6. No Motion Design / Animations (NEW REQUIREMENT)
**Current State:**
- Static UI with no animations
- No transitions between states
- Abrupt page changes and interactions
- Missing that "wow factor" for modern web app

**User Requirement:**
> "I want animation. Like an animated website landing page. Something crazy fancy but not overwhelming. The middle ground, the perfect ground."

**What This Means:**
- Smooth, professional animations throughout the platform
- Page transitions with subtle motion
- Micro-interactions on buttons, cards, inputs
- Scroll-based animations (parallax, fade-ins, reveals)
- Loading states with elegant loaders
- **Not overwhelming** — tasteful, purposeful animation that enhances UX

**Animation Categories:**

**1. Micro-interactions (Buttons, Inputs, Cards)**
- Button hover: Scale + shadow lift
- Button click: Satisfying "press" effect
- Card hover: Subtle elevation change
- Input focus: Border glow animation
- Toggle switches: Smooth slide animation

**2. Page Transitions**
- Route changes: Fade + slide
- Modal enter/exit: Scale + fade
- Drawer slide-in: Smooth ease-out
- Tab switching: Slide animation

**3. Loading States**
- Skeleton loaders for content
- Spinner animations for actions
- Progress bars with smooth fill
- Shimmer effect for placeholders

**4. Scroll Animations**
- Fade in on scroll (dashboard cards)
- Stagger animations (list items appear one by one)
- Parallax effects (hero sections)
- Progress indicators (scroll depth)

**5. Data Visualizations**
- Chart animations on load (Recharts)
- Counter animations (dashboard metrics)
- Status transitions (AI → Human takeover)

**Recommended Libraries:**

**Option 1: Framer Motion (Recommended)**
- Industry standard for React animations
- Declarative API, easy to use
- Great performance
- Built-in gesture support
- Perfect for complex animations

```tsx
import { motion } from 'framer-motion'

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

**Option 2: React Spring**
- Physics-based animations
- More complex, more control
- Great for advanced animations

**Option 3: Tailwind CSS animations (for simple cases)**
- Built-in utilities: `animate-pulse`, `animate-spin`
- Custom animations in tailwind.config.js
- Good for simple hover effects

**The Perfect Balance:**
- Use **Framer Motion** for page transitions, micro-interactions
- Use **Tailwind** for simple hover effects
- Use **CSS keyframes** for infinite animations (spinners)
- Keep animations under 300ms for snappy feel
- Use ease-out curves for natural motion
- Respect `prefers-reduced-motion` (accessibility)

**Animation Principles:**
- **Purposeful**: Every animation should serve UX (not decoration)
- **Fast**: 150-300ms duration (snappy, not sluggish)
- **Subtle**: Catch the eye without demanding attention
- **Consistent**: Same easing curves throughout
- **Accessible**: Respect motion preferences

**Examples to Implement:**

**Landing Page Hero:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <h1>AI BY SEA</h1>
</motion.div>
```

**Dashboard Cards (Stagger):**
```tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {cards.map((card, i) => (
    <motion.div
      key={i}
      variants={itemVariants}
      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" }}
    >
      {card}
    </motion.div>
  ))}
</motion.div>
```

**Button Hover:**
```tsx
<Button
  whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Primary Action
</Button>
```

---

## 📁 Files to Modify

### Components to Create
```
src/components/ui/Button.tsx         # NEW: Unified button component (with Framer Motion)
src/components/ui/Card.tsx           # NEW: Unified card component (with hover animations)
src/lib/design-tokens.md             # NEW: Design token guide (docs)
src/lib/animations/variants.ts       # NEW: Framer Motion variants library
src/lib/animations/transitions.ts    # NEW: Reusable transition configs
src/components/ui/PageTransition.tsx # NEW: Page transition wrapper
src/components/ui/FadeIn.tsx         # NEW: Fade-in on scroll component
src/components/ui/AnimatedCounter.tsx # NEW: Animated number counter
```

### Pages to Audit & Fix (25+ files)
```
src/app/[locale]/(main)/dashboard/page.tsx
src/app/[locale]/(main)/inbox/page.tsx
src/app/[locale]/(main)/agents/page.tsx
src/app/[locale]/(main)/documents/page.tsx
src/app/[locale]/(main)/workflows/page.tsx
src/app/[locale]/(main)/processing-queue/page.tsx
src/app/[locale]/(main)/extracted-data/page.tsx
src/app/[locale]/(main)/settings/page.tsx
src/app/[locale]/conversations/page.tsx
src/app/[locale]/conversations/c/[id]/page.tsx
src/app/[locale]/login/page.tsx
... (all other pages)
```

### Components to Update
```
src/components/layout/Sidebar.tsx
src/components/layout/TopBar.tsx
src/components/layout/BottomNav.tsx
src/components/dashboard/Navigation.tsx
src/components/ui/ResponsiveContainer.tsx
... (all components with inline buttons/cards)
```

---

## 🔧 Technical Approach

### Button Component API
```tsx
import { Button } from '@/components/ui/Button'

// Variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">View Details</Button>
<Button variant="danger">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Default (44px)</Button>
<Button size="lg">Large</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>

// Icon support
<Button icon={<PlusIcon />}>Add Item</Button>
<Button iconOnly icon={<TrashIcon />} aria-label="Delete" />
```

### Card Component API
```tsx
import { Card } from '@/components/ui/Card'

<Card variant="default">
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>
    Content goes here
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>

// Interactive variant (clickable)
<Card variant="interactive" onClick={handleClick}>
  ...
</Card>

// Flat variant (no shadow)
<Card variant="flat">
  ...
</Card>
```

### Design Token Enforcement Strategy
**Phase 1: Spacing audit**
1. Search for all `px-[0-9]`, `py-[0-9]`, `p-[0-9]` usage
2. Replace with design tokens:
   - `px-4` → `px-page` or `px-card` (context-dependent)
   - `py-6` → `py-section`
3. Document patterns in design token guide

**Phase 2: Typography audit**
1. Search for `text-[0-9]xl` usage
2. Replace with heading tokens:
   - `text-3xl` → `heading-1`
   - `text-2xl` → `heading-2`
   - `text-xl` → `heading-3`
3. Add responsive variants where needed

**Phase 3: Color audit**
1. Search for direct color usage: `bg-blue-`, `text-purple-`, etc.
2. Replace with semantic tokens:
   - `bg-blue-500` → `bg-primary-500`
   - `text-teal-600` → `text-service-voice-600` (Voice pages)
   - `text-orange-600` → `text-service-documents-600` (Docs pages)

---

## 🎯 Success Criteria

Phase 21 is complete when:

- [ ] **Components:**
  - [ ] `Button.tsx` created with all variants and sizes
  - [ ] `Card.tsx` created with Header/Content/Footer structure
  - [ ] Components tested (visual + unit tests)
  - [ ] Storybook stories created (prep for Phase 26)

- [ ] **Token Enforcement:**
  - [ ] All pages use spacing tokens (no custom px-*)
  - [ ] All headings use typography tokens (no custom text-*)
  - [ ] All colors use semantic tokens (no direct blue-500)
  - [ ] Design token guide documented

- [ ] **Component Migration:**
  - [ ] All inline buttons replaced with Button component
  - [ ] All card patterns replaced with Card component
  - [ ] Visual regression testing passes

- [ ] **Visual QA:**
  - [ ] Manual review of all pages (light + dark mode)
  - [ ] Mobile + desktop visual consistency verified
  - [ ] Service color coding applied correctly (Voice=teal, Docs=orange)

- [ ] **Animations & Motion Design:**
  - [ ] Framer Motion installed and configured
  - [ ] Animation variants library created (fadeIn, slideIn, stagger, etc.)
  - [ ] Button micro-interactions (hover, tap) implemented
  - [ ] Card hover animations (elevation change)
  - [ ] Page transitions working smoothly
  - [ ] Dashboard cards stagger on load
  - [ ] Scroll-based fade-ins on key sections
  - [ ] Loading states have elegant animations (skeleton, spinner)
  - [ ] `prefers-reduced-motion` respected (accessibility)
  - [ ] Animation timing: 150-300ms (snappy, not sluggish)
  - [ ] **"Wow factor" achieved without overwhelming**

---

## 📚 Related Documentation

**Codebase analysis:**
- [codebase/CONCERNS.md](../../codebase/CONCERNS.md) — UI Consistency Issues (lines 5-62)
- [codebase/CONVENTIONS.md](../../codebase/CONVENTIONS.md) — Current design system patterns
- [codebase/STACK.md](../../codebase/STACK.md) — Tailwind 4 configuration

**Design system (current):**
- `tailwind.config.js` — Custom tokens defined here
- Phase 15 decisions (STATE.md) — When design system was added

**Prior decisions (STATE.md):**
- Phase 15: Responsive breakpoints & design tokens established
- Phase 15: Touch target minimums (44px for buttons)
- Service colors defined (Phase 8): Conversational=blue/purple, Voice=teal, Documents=orange

**Animation resources:**
- Framer Motion: https://www.framer.com/motion/
- Animation examples: https://www.framer.com/motion/examples/
- Tailwind animations: https://tailwindcss.com/docs/animation
- Accessibility: https://web.dev/prefers-reduced-motion/
- UI animation principles: https://material.io/design/motion/

---

## 🚧 Blockers & Dependencies

**Depends on:**
- Phase 20 complete (tests must exist before refactoring)

**Blocks:**
- Phase 22 (Arabic/RTL) — Easier with unified components
- Phase 24 (Performance) — Can optimize Button/Card rendering

**Risks:**
- Large refactor across 25+ files
- Visual regressions possible
- Must not break existing functionality

**Mitigation:**
- Create Button/Card components first
- Test thoroughly before migration
- Migrate one page at a time
- Visual QA after each page

---

## 💡 Planning Notes

**Suggested plan breakdown:**
1. **21-01:** Animation System & Component Library (Framer Motion setup + Button + Card with animations)
2. **21-02:** Design Token Enforcement (spacing + typography + color audit)
3. **21-03:** Component Migration & Animations (replace inline components + add page transitions + micro-interactions)

**Or combine into 2 plans:**
1. **21-01:** UI Component Library with Animations (Framer Motion + Button + Card + animation variants + tests)
2. **21-02:** Token Enforcement & Animation Rollout (full codebase refactor + page transitions + scroll effects)

**Or expand to 4 plans for thoroughness:**
1. **21-01:** Animation Foundation (Framer Motion + variants library + PageTransition + FadeIn components)
2. **21-02:** Animated Components (Button + Card with hover/tap animations + testing)
3. **21-03:** Design Token Enforcement (spacing + typography + color audit across all pages)
4. **21-04:** Full Migration & Animation Polish (replace all inline components + dashboard stagger + scroll effects)

**Estimated complexity:** High (many files, must maintain functionality, animations add complexity)

**Testing strategy:**
- Unit tests for Button/Card components
- Visual regression testing (Playwright screenshots)
- Manual QA in light/dark mode
- Mobile + desktop testing

---

*Context prepared: 2026-02-02*
*Updated: 2026-02-02 — Added animation requirements (Framer Motion, micro-interactions, page transitions)*
*User requirement: "Crazy fancy but not overwhelming — the perfect middle ground"*
*Ready for: /gsd:plan-phase 21*
