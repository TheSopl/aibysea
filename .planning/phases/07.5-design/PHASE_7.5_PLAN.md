---
phase: 7.5-dashboard-redesign
plan: 1
title: Dashboard Design System Overhaul
---

<objective>
Redesign the entire AI By Sea dashboard to match brand guidelines and modern template aesthetic. Transition from current dark theme to cohesive design system using brand colors (Primary Blue #003EF3, Aqua Cyan #4EB6C9, Cool Light Gray #F5F6FA) with rounded components, clear typography hierarchy, and card-based layout.

Output: Fully restyled dashboard with brand colors, consistent typography, responsive layout, and matching template aesthetic (Purity UI style).
</objective>

<context>
@.planning/PROJECT.md
@src/app/dashboard/layout.tsx
@src/components/dashboard/Header.tsx
@src/components/dashboard/Navigation.tsx
@src/components/dashboard/MetricsCard.tsx
@src/components/dashboard/AIMetricsDashboard.tsx
@tailwind.config.ts
</context>

<task type="auto">
  <name>Setup Brand Color System in Tailwind</name>
  <action>
    1. Open tailwind.config.ts
    2. Add brand color tokens to theme.colors:
       - primary: #003EF3 (Primary Blue)
       - accent: #4EB6C9 (Aqua Cyan)
       - light-bg: #F5F6FA (Cool Light Gray)
       - dark: #1a1a1a (Text/elements)
    3. Extend with proper color scale for gradients and states
    4. Add border-radius defaults: 8px minimum
    5. Test with: npm run dev and verify colors load in DevTools
  </action>
  <verify>Tailwind config contains brand color definitions, dev server runs without errors, colors appear in Tailwind IntelliSense</verify>
</task>

<task type="auto">
  <name>Redesign Header Component with Brand Colors</name>
  <action>
    1. Open src/components/dashboard/Header.tsx
    2. Update styling:
       - Background: Use light-bg (#F5F6FA) or white
       - Logo area: Add primary blue accent
       - Search bar: Light gray background, blue focus state
       - User menu: Aqua cyan for active/hover states
    3. Apply rounded corners (8px) to inputs and buttons
    4. Add subtle shadow for depth
    5. Ensure responsive: hamburger menu on mobile
  </action>
  <verify>Header displays with brand colors, logo visible, search bar works, responsive on mobile</verify>
</task>

<task type="auto">
  <name>Redesign Navigation Sidebar with Brand System</name>
  <action>
    1. Open src/components/dashboard/Navigation.tsx
    2. Update styling:
       - Background: White or very light gray
       - Icons: Primary blue by default
       - Active state: Aqua cyan background with rounded 8px
       - Hover state: Light aqua background
       - Text: Dark (#1a1a1a) with bold/regular weight hierarchy
    3. Add collapsible sections with smooth transitions
    4. Add user profile section at bottom with avatar
    5. Ensure mobile: collapsible/hamburger menu
  </action>
  <verify>Sidebar displays with brand colors, active state shows in aqua, icons properly colored, collapsible sections work</verify>
</task>

<task type="auto">
  <name>Restyle Metric Cards with Brand Design</name>
  <action>
    1. Open src/components/dashboard/MetricsCard.tsx
    2. Update styling:
       - Background: White or light-bg with subtle shadow
       - Border: Subtle gray border or no border (shadow only)
       - Border-radius: 8px minimum, consider 12px
       - Icon: Primary blue or accent cyan depending on metric type
       - Number: Dark text, bold weight
       - Trend: Accent color for positive, red for negative
    3. Add smooth hover effects (slight scale, shadow increase)
    4. Ensure spacing: padding, margin consistent with design system
  </action>
  <verify>Metric cards render with brand colors, shadows visible, hover effects work smoothly, spacing consistent</verify>
</task>

<task type="auto">
  <name>Update Chart Components with Brand Colors</name>
  <action>
    1. Open src/components/dashboard/LatencyChart.tsx and ConfidenceScores.tsx
    2. Update Recharts styling:
       - Primary colors: Use #003EF3 for main data
       - Accent colors: Use #4EB6C9 for secondary data
       - Gradient fills: Blue to cyan gradients
       - Text: Dark gray for labels and legends
       - Grid: Subtle light gray
       - Background: Transparent or light-bg
    3. Add brand colors to: Line, Bar, Area, Tooltip components
    4. Test with real data to ensure colors are distinct and readable
  </action>
  <verify>Charts display with brand color gradients, legends show correct colors, data is readable with good contrast</verify>
</task>

<task type="auto">
  <name>Update Dashboard Layout Spacing and Typography</name>
  <action>
    1. Open src/app/dashboard/layout.tsx
    2. Review grid spacing: ensure generous padding and breathing room
    3. Update typography hierarchy:
       - Headings: Bold (700) or ExtraBold (900)
       - Body: Regular (400)
       - Small text: ExtraLight (100)
    4. Add consistent gap between cards (16-24px)
    5. Ensure max-width for readability (not full-width edge-to-edge)
    6. Test responsive: mobile (sm), tablet (md), desktop (lg, xl)
  </action>
  <verify>Layout has generous spacing, typography hierarchy clear, responsive breakpoints work, no text edge-to-edge on desktop</verify>
</task>

<task type="auto">
  <name>Add Visual Polish and Animations</name>
  <action>
    1. Add smooth transitions to all interactive elements (200-300ms)
    2. Implement hover states: slight scale (1.02-1.05) and shadow increase
    3. Add loading states with brand colors (blue spinner)
    4. Implement fade-in animations for initial page load
    5. Add card borders or subtle dividers where needed for clarity
    6. Polish focus states for keyboard navigation (blue outline)
  </action>
  <verify>Transitions smooth, hover effects visible, loading states show, focus states accessible, animations not jarring</verify>
</task>

<task type="auto">
  <name>Verify Responsive Design and Mobile Experience</name>
  <action>
    1. Test on mobile (375px): sidebar collapses, layout single-column
    2. Test on tablet (768px): 2-column grid, navigation sidebar visible
    3. Test on desktop (1024px+): full layout with 3-column grid, sidebar visible
    4. Check all touch targets are 44px+ (accessibility)
    5. Verify images/charts scale properly
    6. Test on actual devices or use Chrome DevTools responsive mode
  </action>
  <verify>Mobile layout single-column and readable, tablet layout balanced, desktop layout spacious, all touch targets adequate, charts responsive</verify>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Complete dashboard redesign with brand color system, updated typography hierarchy, card-based layout with 8px borders, and responsive design</what-built>
  <how-to-verify>
    1. Open dashboard in browser (npm run dev)
    2. Check header: brand colors applied, search bar works, responsive hamburger visible
    3. Check sidebar: icons blue, active state cyan, collapsible, user menu at bottom
    4. Check metric cards: white with subtle shadow, icons colored, spacing generous
    5. Check charts: blue/cyan gradients, readable labels, responsive
    6. Check mobile (DevTools): sidebar collapsed, single-column layout
    7. Compare to original: cleaner, more modern, consistent brand colors
  </how-to-verify>
  <resume-signal>Type "approved" if design looks good, or describe any issues to fix</resume-signal>
</task>

<verification>
- All dashboard components restyled with brand colors
- Typography hierarchy implemented (bold headings, regular body, light accents)
- Responsive layout works on mobile/tablet/desktop
- Cards have 8px borders and subtle shadows
- Charts use brand color gradients
- Hover states and transitions smooth
- No visual conflicts or inconsistencies
</verification>

<success_criteria>
- [ ] All pages styled with brand colors (primary blue, aqua cyan, light gray)
- [ ] Consistent typography throughout (ExtraLight, Regular, Bold, ExtraBold)
- [ ] Responsive on mobile/tablet/desktop
- [ ] Card-based layout with 8px borders and breathing room
- [ ] No dark theme remnants visible
- [ ] Charts use brand color gradients
- [ ] Sidebar collapsible and functional
- [ ] All interactive elements have smooth transitions
- [ ] Matches modern/Purity UI template aesthetic
- [ ] Checkpoint verified: design approved by user
</success_criteria>

<output>
Create `.planning/PHASE_7.5_PLAN_1-SUMMARY.md` documenting:

## Summary Structure
- **Duration:** [execution time]
- **Tasks completed:** 8 auto + 1 checkpoint
- **Files modified:** [list all component files changed]
- **Commits:** Document each task commit hash
- **Accomplishments:** Brand color system implemented, all components restyled, responsive layout verified
- **Deviations:** [any changes to plan during execution]
- **Issues encountered:** [if any]
- **Next phase readiness:** Dashboard redesign complete, ready for Phase 8 (Real-time HUD)

Include commit hashes for all 8 task commits plus metadata commit.
</output>
