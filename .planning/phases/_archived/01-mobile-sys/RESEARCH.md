# Phase 01: Mobile Foundation & Design System

**Generated:** 2026-01-27
**Research Type:** Comprehensive, Production-Grade
**Quality Standard:** Bulletproof, Zero-Compromise

---

## Executive Summary

### Current State Audit

| Aspect | Current Implementation | Status | Grade |
|--------|------------------------|--------|-------|
| Breakpoints | `md:` (768px), `lg:` (1024px) only | Incomplete | C |
| Custom Breakpoints | `xs:`, `sm:`, `tablet:` | Newly added | A |
| Touch Targets | `.touch-target` class defined | Needs verification | B |
| Safe Areas | `env(safe-area-*)` in globals.css | Present | A |
| Responsive Spacing | Partial (`px-4 sm:px-5`) | Needs tokens | B |
| Typography Scale | No responsive variants | Missing | D |
| CSS Variables | Theme colors defined | Needs expansion | B |
| iOS 100vh Fix | `--app-height` + JS | Working | A |

### Completed Work (from Phase 15)

Based on recent implementation:
- Custom breakpoints added: `xs: 320px`, `sm: 375px`, `md: 428px`, `tablet: 768px`
- Touch target utilities: `.touch-target` (44px minimum)
- Safe area insets in globals.css
- Responsive spacing variables started

### Remaining Gaps

1. **Typography scale** - No responsive font sizes defined
2. **Spacing tokens** - Not fully systematized
3. **Base components** - `ResponsiveContainer` exists but needs review
4. **Touch target audit** - Not verified across all components
5. **Documentation** - No usage guide for new breakpoints

---

## Non-Negotiable Objectives

### What Success Looks Like

1. **Complete breakpoint system** - 7 stops from 320px to 1536px, documented
2. **Touch target compliance** - Every interactive element 44px minimum
3. **Responsive tokens** - Spacing, typography, container widths systematized
4. **Base components ready** - ResponsiveContainer, ResponsiveGrid, ResponsiveStack
5. **Safe area handling** - Works on all notch/Dynamic Island devices
6. **Dark mode support** - All tokens work in light and dark modes
7. **Zero breaking changes** - Existing desktop layouts remain functional

### Measurable Acceptance Criteria

| Criterion | Target | Verification |
|-----------|--------|--------------|
| Breakpoints defined | 7 stops | tailwind.config.js audit |
| Touch target violations | 0 | Manual audit + DevTools |
| CSS variables | 20+ tokens | globals.css audit |
| Base components | 3 minimum | Component library review |
| Lighthouse Accessibility | > 95 | Lighthouse CI |
| iPhone SE support | Full | Manual test |
| Safe area tested | 3 devices | Real device test |

---

## Hard Boundaries

### Included (In Scope)

1. **Tailwind Configuration**
   - Complete breakpoint system
   - Custom spacing scale
   - Typography extensions
   - Color token verification

2. **CSS Design Tokens**
   - Responsive spacing variables
   - Touch target utilities
   - Safe area utilities
   - Typography scale utilities

3. **Base Responsive Components**
   - `ResponsiveContainer` (verify/enhance)
   - `ResponsiveGrid` (create if missing)
   - `ResponsiveStack` (create if missing)

4. **Documentation**
   - Breakpoint usage guide
   - Touch target guidelines
   - Component API docs

5. **Touch Target Audit**
   - Verify all buttons
   - Verify all links
   - Verify all form inputs
   - Verify all list items

### Explicitly Excluded (Out of Scope)

| Item | Reason | Deferred To |
|------|--------|-------------|
| Navigation components | Different concern | Phase 02 |
| Page layouts | Different concern | Phase 03-04 |
| Performance optimization | Different concern | Phase 05 |
| New UI features | Scope creep | v5.0 |
| Backend changes | Not responsive | N/A |

---

## Best-Practice Approach

### 1. Breakpoint System (Verified)

```javascript
// tailwind.config.js
screens: {
  'xs': '320px',     // iPhone SE, small Android
  'sm': '375px',     // Standard iPhone (12/13/14)
  'md': '428px',     // iPhone Pro Max, large Android
  'tablet': '768px', // iPad Mini, tablets
  'lg': '1024px',    // iPad landscape, small laptops
  'xl': '1280px',    // Desktop
  '2xl': '1536px',   // Large desktop
}
```

**Why These Values:**
- `320px` - iPhone SE (still 8% of iOS traffic)
- `375px` - iPhone 12/13/14 baseline (largest segment)
- `428px` - iPhone Pro Max (growing rapidly)
- `768px` - iPad Mini portrait (tablet threshold)
- `1024px` - iPad landscape / laptop (desktop-like)
- `1280px` / `1536px` - Desktop monitors

### 2. Touch Target System

**WCAG 2.5.8 Requirements:**
- Level AA: 24×24px minimum
- Level AAA: 44×44px minimum
- Platform recommendation: 48×48px

**Our Standard: 44px minimum (AAA compliant)**

```css
/* globals.css */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

.touch-target-lg {
  min-height: 48px;
  min-width: 48px;
}

/* For icon buttons that need visual 24px but 44px tap area */
.touch-target-expanded {
  position: relative;
}
.touch-target-expanded::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
}
```

### 3. Responsive Spacing Tokens

```css
/* globals.css */
:root {
  /* Page-level padding */
  --spacing-page-x: 1rem;        /* 16px - mobile */
  --spacing-page-y: 1rem;        /* 16px - mobile */

  /* Card/panel padding */
  --spacing-card: 1rem;          /* 16px - mobile */

  /* Section gaps */
  --spacing-section: 1rem;       /* 16px - mobile */

  /* Stack gaps */
  --spacing-stack-sm: 0.5rem;    /* 8px */
  --spacing-stack-md: 0.75rem;   /* 12px */
  --spacing-stack-lg: 1rem;      /* 16px */
}

@media (min-width: 375px) {
  :root {
    --spacing-page-x: 1.25rem;   /* 20px */
  }
}

@media (min-width: 768px) {
  :root {
    --spacing-page-x: 1.5rem;    /* 24px */
    --spacing-page-y: 1.5rem;    /* 24px */
    --spacing-card: 1.5rem;      /* 24px */
    --spacing-section: 1.5rem;   /* 24px */
  }
}

@media (min-width: 1024px) {
  :root {
    --spacing-page-x: 2rem;      /* 32px */
    --spacing-page-y: 2rem;      /* 32px */
    --spacing-card: 2rem;        /* 32px */
    --spacing-section: 2rem;     /* 32px */
  }
}
```

### 4. Typography Scale

```css
/* globals.css */
:root {
  /* Headings */
  --text-h1: 1.5rem;            /* 24px - mobile */
  --text-h2: 1.25rem;           /* 20px - mobile */
  --text-h3: 1.125rem;          /* 18px - mobile */

  /* Body */
  --text-body: 0.875rem;        /* 14px - mobile */
  --text-body-lg: 1rem;         /* 16px - mobile */

  /* Caption */
  --text-caption: 0.75rem;      /* 12px */
  --text-caption-lg: 0.8125rem; /* 13px */
}

@media (min-width: 768px) {
  :root {
    --text-h1: 2rem;            /* 32px */
    --text-h2: 1.5rem;          /* 24px */
    --text-h3: 1.25rem;         /* 20px */
    --text-body: 1rem;          /* 16px */
    --text-body-lg: 1.125rem;   /* 18px */
  }
}

@media (min-width: 1024px) {
  :root {
    --text-h1: 2.5rem;          /* 40px */
    --text-h2: 1.875rem;        /* 30px */
    --text-h3: 1.5rem;          /* 24px */
  }
}
```

### 5. Safe Area Handling

```css
/* globals.css - already present, verify */
:root {
  --safe-area-top: env(safe-area-inset-top, 0px);
  --safe-area-right: env(safe-area-inset-right, 0px);
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-left: env(safe-area-inset-left, 0px);
}

/* Utilities */
.safe-top { padding-top: var(--safe-area-top); }
.safe-bottom { padding-bottom: var(--safe-area-bottom); }
.safe-left { padding-left: var(--safe-area-left); }
.safe-right { padding-right: var(--safe-area-right); }
.safe-all {
  padding-top: var(--safe-area-top);
  padding-right: var(--safe-area-right);
  padding-bottom: var(--safe-area-bottom);
  padding-left: var(--safe-area-left);
}
```

### 6. Base Component: ResponsiveContainer

```tsx
// src/components/ui/ResponsiveContainer.tsx (existing - verify)
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'main' | 'article';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

export function ResponsiveContainer({
  children,
  className,
  as: Component = 'div',
  maxWidth = 'xl',
  padding = true,
}: ResponsiveContainerProps) {
  return (
    <Component
      className={cn(
        'w-full mx-auto',
        maxWidthClasses[maxWidth],
        padding && 'px-4 sm:px-5 tablet:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </Component>
  );
}
```

### 7. Base Component: ResponsiveGrid

```tsx
// src/components/ui/ResponsiveGrid.tsx (create if missing)
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    tablet?: number;
    lg?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

const gapClasses = {
  sm: 'gap-3 tablet:gap-4',
  md: 'gap-4 tablet:gap-6',
  lg: 'gap-6 tablet:gap-8',
};

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, tablet: 2, lg: 3 },
  gap = 'md',
}: ResponsiveGridProps) {
  const colClasses = [
    `grid-cols-${cols.default || 1}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.tablet && `tablet:grid-cols-${cols.tablet}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={cn('grid', colClasses, gapClasses[gap], className)}>
      {children}
    </div>
  );
}
```

---

## Edge Cases & Failure Modes

### Critical Edge Cases

| Edge Case | Risk Level | Failure Mode | Mitigation |
|-----------|------------|--------------|------------|
| iPhone SE (320px) | HIGH | Content overflow | Test with xs: breakpoint |
| Foldable phones (280px folded) | MEDIUM | Critical overflow | min-width: 280px on body |
| iPad split view | MEDIUM | Half-width (507px) | Test tablet: breakpoint |
| Dynamic Island (iOS) | MEDIUM | Safe area overlap | Test with real iPhone 14+ |
| Android system nav | MEDIUM | Bottom overlap | Test safe-area-inset-bottom |
| Landscape phones | MEDIUM | Vertical space limited | Test header/nav heights |
| RTL languages | LOW | Layout mirror issues | Test with dir="rtl" |
| Large font settings | MEDIUM | Layout breaks | Test with 200% font size |

### Stress Test Scenarios

1. **Smallest Screen**: 280×500px viewport - no horizontal scroll
2. **Largest Phone**: 430×932px (iPhone 14 Pro Max) - efficient use of space
3. **Accessibility Zoom**: 200% zoom - all content accessible
4. **Safe Area Max**: Notch + home indicator - no overlap
5. **Keyboard Open**: 375×400px visible - inputs still usable

---

## Implementation Order & Dependencies

### Dependency Graph

```
No prior dependencies (foundational phase)
    │
    ▼
┌──────────────────────────────────────┐
│ Step 1: Verify Tailwind Config       │
│ - Confirm all breakpoints present    │
│ - Add any missing extensions         │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 2: CSS Tokens Expansion         │
│ - Add spacing variables              │
│ - Add typography variables           │
│ - Add utility classes                │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 3: Base Components              │
│ - Verify ResponsiveContainer         │
│ - Create ResponsiveGrid              │
│ - Create ResponsiveStack             │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 4: Touch Target Audit           │
│ - Audit all buttons                  │
│ - Audit all interactive elements     │
│ - Fix violations                     │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 5: Documentation                │
│ - Breakpoint usage guide             │
│ - Component API docs                 │
└──────────────────────────────────────┘
```

### Files to Modify

| File | Changes | Priority |
|------|---------|----------|
| `tailwind.config.js` | Verify breakpoints, add extensions | P0 |
| `src/app/globals.css` | Add tokens, utilities | P0 |
| `src/components/ui/ResponsiveContainer.tsx` | Verify/enhance | P1 |
| `src/components/ui/ResponsiveGrid.tsx` | CREATE | P1 |
| `src/components/ui/ResponsiveStack.tsx` | CREATE | P1 |
| `src/components/ui/TouchTarget.tsx` | CREATE (wrapper) | P2 |

---

## Cross-Phase Consistency

### This Phase Establishes

Everything in Phase 01 becomes the foundation for Phases 02-05:

| Token/Pattern | Used In |
|---------------|---------|
| `tablet:` breakpoint | All phase split views |
| `.touch-target` class | All interactive elements |
| `--spacing-*` variables | All page layouts |
| `ResponsiveContainer` | All page wrappers |
| Safe area utilities | Navigation, inputs |

### Naming Conventions (Mandatory)

| Item | Convention | Example |
|------|------------|---------|
| Breakpoints | Tailwind standard | `xs:`, `tablet:` |
| CSS variables | Kebab-case | `--spacing-page-x` |
| Components | PascalCase | `ResponsiveGrid` |
| Utilities | Kebab-case | `.touch-target` |

### Design Tokens (Canonical Reference)

```javascript
// All phases must use these values
const tokens = {
  breakpoints: {
    xs: '320px',
    sm: '375px',
    md: '428px',
    tablet: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  touch: {
    minimum: '44px',
    recommended: '48px',
  },
  animation: {
    instant: '50ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  zIndex: {
    dropdown: 40,
    modal: 50,
    navigation: 50,
    toast: 60,
  },
};
```

---

## Testing Protocol

### Device Matrix

| Device | Viewport | Priority |
|--------|----------|----------|
| iPhone SE | 320×568 | P0 |
| iPhone 14 | 390×844 | P0 |
| iPhone 14 Pro Max | 430×932 | P0 |
| iPad Mini | 744×1133 | P0 |
| Pixel 7 | 412×915 | P1 |
| Samsung S23 | 360×780 | P1 |
| Desktop | 1280×800 | P1 |

### Test Scenarios

1. **Breakpoint Transitions**: Resize from 320px → 1536px, verify no layout jumps
2. **Touch Targets**: Tab through all interactive elements, verify 44px minimum
3. **Safe Areas**: Test on notched device, verify no content hidden
4. **Typography**: Verify readability at all breakpoints
5. **Dark Mode**: Verify all tokens work in dark mode
6. **Zoom**: Test at 200% zoom, verify content accessible

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing layouts | Medium | High | Regression testing |
| Token naming conflicts | Low | Medium | Clear naming convention |
| Missing edge case | Medium | Medium | Comprehensive device testing |
| Performance regression | Low | Low | No heavy additions |
| Browser compatibility | Low | Medium | Test Safari, Chrome, Firefox |

---

## Success Metrics

After Phase 01 completion:

| Metric | Current | Target |
|--------|---------|--------|
| Breakpoints defined | 4 | 7 |
| CSS tokens defined | ~10 | 25+ |
| Touch target violations | Unknown | 0 |
| Base components | 1 | 3 |
| Documentation pages | 0 | 1 |
| Lighthouse Accessibility | Unknown | > 95 |

---

## Sources & References

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [WCAG 2.5.8 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Apple Human Interface Guidelines - Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Material Design - Responsive Layout](https://m3.material.io/foundations/layout/understanding-layout/overview)
- [iOS Screen Sizes](https://www.screensizes.app/)
- [CSS env() Safe Area](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
