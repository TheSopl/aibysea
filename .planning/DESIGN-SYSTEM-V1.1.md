# AIBYSEA v1.1 - Design System

## 🎨 Visual Language: "Intelligent Simplicity"

Futuristic + minimalist + accessible. Like looking at a command center that's actually pleasant to use.

---

## Color Palette

### Primary Palette
```
Deep Navy Background:  #0F1419  (almost black, slightly blue)
Dark Surface:          #1A1F2E  (sidebar, cards)
Accent Surface:        #252D3D  (hover states, secondary areas)

Electric Teal:         #00D9FF  (primary accent, AI, success)
Neon Purple:           #A855F7  (secondary accent, highlights)
Soft Pink/Magenta:     #EC4899  (tertiary accent, warnings, escalations)

Success Green:         #10B981  (positive sentiment, resolved)
Caution Amber:         #F59E0B  (warnings, risk yellow)
Danger Red:            #EF4444  (urgent, angry, high risk)

Text Primary:          #F5F7FA  (main text, 95% opacity)
Text Secondary:        #9CA3AF  (descriptions, metadata)
Text Tertiary:         #6B7280  (disabled, faint)

Neutral Gray:          #4B5563  (borders, dividers)
```

### Accent Combinations
- **AI Messages**: Teal background (#00D9FF) with dark text
- **Customer Messages**: Purple-tinted card (#252D3D) with light text
- **Health/Success**: Teal glow effect
- **Risk/Urgent**: Pink/Red glow effect
- **Learning**: Purple gradient pulse

---

## Typography

### Font Family: "Inter" + "JetBrains Mono"
```
Headings:      Inter, 600-700 weight, 24px-48px
Body:          Inter, 400 weight, 14px-16px
Metadata:      Inter, 500 weight, 12px-13px (slightly uppercase)
Code/Tech:     JetBrains Mono, 400 weight, 12px (for metrics/confidence scores)
```

### Text Hierarchy
```
H1: 48px | Bold 700 | Letter-spacing: -0.5px (page titles)
H2: 32px | Bold 600 | Letter-spacing: -0.3px (section headers)
H3: 24px | Semi 600 | Letter-spacing: -0.2px (subsections)
Body: 14px | Regular 400 | Line-height: 1.6 (descriptions)
Small: 12px | Regular 400 | Line-height: 1.5 (metadata)
Label: 11px | Medium 500 | Letter-spacing: 0.5px (UPPERCASE labels)
```

---

## Layout & Spacing

### Grid System
```
12-column grid
Gutter: 24px
Margin: 24px/32px padding from edges
```

### Spacing Scale
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px

Sidebar: 280px width
Main content: Remaining width - 24px
```

### Component Sizing
```
Cards: Min 240px width
Metric cards: 200-300px (responsive)
Buttons: 44px height (clickable minimum)
Input: 40px height
Avatar: 48px (large), 32px (medium), 24px (small)
```

---

## Component Design Language

### Cards & Surfaces
```
Background: #1A1F2E with 1px border #252D3D
Border radius: 12px (standard), 16px (large cards)
Padding: 20px (standard), 24px (spacious)
Shadow: 0px 8px 24px rgba(0, 0, 0, 0.4) (subtle depth)

Glassmorphism effect (optional premium):
├─ Backdrop blur: 8px
├─ Background: rgba(26, 31, 46, 0.6)
├─ Border: 1px solid rgba(0, 217, 255, 0.1)
└─ Creates "floating" effect
```

### Buttons
```
Primary Button:
├─ Background: Linear gradient (Teal #00D9FF → Purple #A855F7)
├─ Text: #0F1419 (dark text on bright background)
├─ Border radius: 8px
├─ Padding: 12px 24px
├─ Shadow: 0px 4px 12px rgba(0, 217, 255, 0.3)
└─ Hover: Brighten + scale 1.02

Secondary Button:
├─ Background: #252D3D
├─ Border: 1px solid #00D9FF
├─ Text: #00D9FF
└─ Hover: Fill with Teal at 10% opacity

Danger Button (Escalate):
├─ Background: Linear gradient (Pink #EC4899 → Red #EF4444)
├─ Text: white
└─ Hover: Intense glow effect
```

### Badges & Status Indicators
```
Health Badge (94/100):
├─ Background: Teal gradient circular
├─ Text: White, bold
├─ Size: 64px diameter
├─ Glow: Soft teal shadow

Sentiment Badge:
├─ 🟢 Positive: Green with teal glow
├─ 🟡 Neutral: Gray with soft glow
├─ 🔴 Angry: Red with pulsing glow
└─ Animation: Subtle pulse every 2s

Risk Badge:
├─ 🟢 LOW: Green
├─ 🟡 MEDIUM: Amber
├─ 🔴 HIGH: Red with warning pulsing
└─ Uses same colors as sentiment

Confidence Meter:
├─ Circular progress: 87%
├─ Arc color: Teal → Purple gradient
├─ Inner text: 87%
└─ Animation: Count up when changing
```

### Charts & Metrics
```
Bars/Lines: Teal (#00D9FF) as primary color
Gradient fills: Teal → Purple
Background: Subtle grid at #252D3D
Hover: Teal glow effect
Trend arrows: Green ↑ (up), Red ↓ (down), Gray → (stable)

Metric display format:
├─ Number: Large, bold, monospace
├─ Label: Small, uppercase, secondary text
├─ Trend: Colored arrow + percentage
└─ Sparkline: Mini chart (optional)
```

### Input Fields
```
Background: #252D3D
Border: 1px solid #4B5563
Border radius: 8px
Text color: #F5F7FA
Padding: 12px 16px

Focus state:
├─ Border: 2px solid #00D9FF
├─ Box-shadow: 0px 0px 12px rgba(0, 217, 255, 0.2)
└─ Background: slightly lighter

Placeholder: #6B7280 (muted)
```

### Avatars
```
Rashed Avatar:
├─ Size: 48px (standard), 64px (large)
├─ Border radius: 12px
├─ Border: 2px solid #00D9FF
├─ Shadow: 0px 4px 12px rgba(0, 217, 255, 0.3)
├─ Glow: Soft teal aura (6px blur, 0.2 opacity)
└─ Online indicator: Green dot (top right)
```

---

## Visual Effects & Animations

### Transitions
```
Standard timing: 200ms cubic-bezier(0.4, 0, 0.2, 1)
State changes: fade + slide (200ms)
Hover effects: instant glow + 100ms scale
Message arrival: slide-in from bottom (300ms) + fade
```

### Micro-Interactions
```
Hover on card:
├─ Scale: 1.02 (slight grow)
├─ Shadow: Intensify
├─ Glow: Teal aura appears
└─ Duration: 200ms ease-out

Click feedback:
├─ Flash: Brief (0.1s) brightness increase
├─ Ripple: (optional) Subtle radial effect
└─ Duration: 200ms

Loading states:
├─ Pulse: Soft opacity wave (0.5s → 1s → 0.5s)
├─ Color: Teal glow intensifies
└─ Text: "Loading..." with animated dots
```

### Glowing Effects
```
Teal Glow (Success/Active):
├─ box-shadow: 0 0 24px rgba(0, 217, 255, 0.4),
│             0 0 12px rgba(0, 217, 255, 0.2)
└─ Filter: drop-shadow (for text/icons)

Purple Glow (Highlight):
├─ box-shadow: 0 0 24px rgba(168, 85, 247, 0.3)
└─ Used on important metrics

Red Glow (Alert):
├─ box-shadow: 0 0 24px rgba(239, 68, 68, 0.3)
└─ Used on risk/urgent items

Pulsing effect (Attention):
├─ Animation: glow from 0.5 → 1 → 0.5 (2s loop)
└─ Applied to: Risk badges, escalation warnings
```

### Message Animations
```
AI message arrival:
├─ Fade in: 0 → 1 (300ms)
├─ Slide: translateY(16px) → 0 (300ms)
└─ Stagger: Each word ~20ms apart (typewriter feel)

Customer message:
├─ Fade in: 0 → 1 (200ms)
├─ Slide from right: translateX(20px) → 0 (200ms)
└─ No stagger (instant appear)

Reasoning reveal (expand):
├─ Max-height: 0 → full (300ms)
├─ Opacity: 0 → 1 (300ms)
└─ Slight rotation: -2deg → 0deg
```

---

## Dark Theme Deep Dive

```
Why dark:
├─ Futuristic feel (like command center)
├─ Reduces eye strain for long sessions
├─ Makes neon colors pop more
├─ Modern aesthetic
└─ Better contrast for accessibility

Implementation:
├─ Use #0F1419 as absolute black (not pure #000000)
├─ Text always > 70% brightness for WCAG AA
├─ Teal accent must be saturated (#00D9FF, not muted)
└─ No pure white backgrounds (use off-white #F5F7FA)
```

---

## Responsive Design

### Breakpoints
```
Mobile:     < 640px  (sidebar collapses to icons)
Tablet:     640-1024px (single column layout)
Desktop:    > 1024px (sidebar + main content side-by-side)
4K:         > 2560px (increase card sizes, spacing)
```

### Mobile Adaptations
```
Sidebar:
├─ Collapses to 80px width (icon only)
├─ Icon labels appear on hover (tooltip)
└─ Hamburger menu available

Cards:
├─ Stack vertically (full width)
├─ Reduce padding to 16px
└─ Smaller font sizes (12px body)

Charts:
├─ Responsive width (100% of container)
├─ Reduce height (200px → 150px)
└─ Touch-friendly axes

Buttons:
├─ Full width (except in groups)
├─ Height: 48px (thumb-sized)
└─ Spacing: 12px between
```

---

## Icon Style

```
Style: Heroicons (open-source, clean, futuristic)
Size scale: 16px, 20px, 24px, 32px
Stroke width: 2px (clean, not heavy)
Color: Inherit from text color, or teal for important

Icon + Text pairing:
├─ Icon on left: 8px gap
├─ Icon size: 20px (for labels)
└─ Always aligned to text baseline
```

---

## Example Component: Metric Card

```
┌─────────────────────────────────┐
│  Response Time                  │  ← Label (11px, UPPERCASE, gray)
│                                 │
│  245ms                          │  ← Main metric (32px, bold, teal mono)
│                                 │
│  ↑ 12ms vs 24h ago   Last 24h   │  ← Trend + timeframe (12px, secondary)
│                                 │
│  ▁▃▂▅▄▂▃▆▇▅▆▇▆▅▃▂▄▃  ← Mini chart  │
└─────────────────────────────────┘
 (background: #1A1F2E, border: #252D3D, glow: teal on hover)
```

---

## Page Layout Template

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  AIBYSEA              Time  Timezone  [Refresh]  │  ← Header
├────────┬────────────────────────────────────────────────┤
│        │                                                │
│ Icons  │  Dashboard / Contacts / Conversations         │
│ only   │                                                │
│ 80px   │  ┌──────────────────────────────────────┐    │
│        │  │ Main Content                         │    │
│        │  │ Cards / Charts / Messages            │    │
│ Hover  │  │ (Responsive grid)                    │    │
│ shows  │  │                                      │    │
│ labels │  │                                      │    │
│        │  │                                      │    │
│        │  │                                      │    │
│        │  └──────────────────────────────────────┘    │
│        │                                                │
└────────┴────────────────────────────────────────────────┘
         ↑                       ↑
       Sidebar              Main content
       (280px desktop)      (responsive)
```

---

## Accessibility

```
Color contrast:
├─ Text on background: >= 7:1 (WCAG AAA)
├─ Icon on background: >= 3:1 (WCAG AA)
└─ Use color + symbol (not color alone for meaning)

Keyboard navigation:
├─ Tab order: logical (left-to-right, top-to-bottom)
├─ Focus visible: 2px teal border with offset
└─ Escape to close modals/menus

Screen readers:
├─ All icons have aria-labels
├─ Status badges described (not just color)
└─ Dynamic content announces changes
```

---

## Animation Best Practices

```
Performance:
├─ Use transform + opacity (GPU accelerated)
├─ Avoid animating: width, height, position
└─ Prefer: scale, translate, rotate, opacity

Accessibility:
├─ Respect prefers-reduced-motion
├─ Keep animations under 500ms (snappy)
└─ No auto-playing heavy animations
```

---

## Summary

**Visual Identity:**
- Deep navy + electric teal + neon purple
- Clean typography (Inter + JetBrains Mono)
- Glassmorphism + glowing effects
- Smooth micro-interactions
- Dark mode futuristic aesthetic
- Minimal but impactful

**Feel:**
- Command center that doesn't overwhelm
- Every element has purpose
- Smooth, responsive, pleasant
- Impressive without being distracting
- Next-gen but accessible

**Code Framework:**
- Tailwind CSS (extend with custom colors)
- Framer Motion (animations)
- Radix UI (accessible components)
- HeadlessUI (dropdowns, modals, etc)

---

*Design Direction: APPROVED*
*Status: Ready for implementation*
