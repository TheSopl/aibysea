# Phase 05: Performance Cycle - Bundle Optimization & Mobile Performance

**Generated:** 2026-01-27
**Research Type:** Comprehensive, Production-Grade
**Quality Standard:** Bulletproof, Zero-Compromise

---

## Executive Summary

### Current State Audit

| Metric | Current (Estimated) | Target | Gap |
|--------|---------------------|--------|-----|
| Initial JS Bundle | ~800KB+ | <300KB | HIGH |
| First Contentful Paint | Unknown | <1.5s | UNKNOWN |
| Time to Interactive | Unknown | <3.0s | UNKNOWN |
| Lighthouse Performance | Unknown | >85 | UNKNOWN |
| Lighthouse Mobile | Unknown | >80 | UNKNOWN |
| Core Web Vitals (LCP) | Unknown | <2.5s | UNKNOWN |
| Core Web Vitals (FID) | Unknown | <100ms | UNKNOWN |
| Core Web Vitals (CLS) | Unknown | <0.1 | UNKNOWN |

### Critical Findings

**Heavy Dependencies Identified:**

| Package | Size (minified) | Impact | Lazy-Loadable? |
|---------|-----------------|--------|----------------|
| recharts | ~400KB | HIGH | YES - Dashboard only |
| framer-motion | ~150KB | MEDIUM | PARTIAL |
| @supabase/supabase-js | ~100KB | MEDIUM | NO - Core |
| lucide-react | ~50KB (tree-shaken) | LOW | N/A |
| numeral | ~15KB | LOW | YES |

**No Code Splitting Found:**
```tsx
// Current: Everything imported synchronously
import { AreaChart, Area, XAxis, YAxis } from 'recharts';

// Required: Dynamic import
const AreaChart = dynamic(() =>
  import('recharts').then(mod => mod.AreaChart),
  { ssr: false }
);
```

**No Bundle Analyzer Configured:**
- Cannot measure what we cannot see
- No visibility into actual bundle composition

---

## Non-Negotiable Objectives

### What Success Looks Like

1. **Sub-300KB initial bundle** - Core app loads fast on 3G
2. **Charts lazy-loaded** - Only load recharts on dashboard
3. **Images optimized** - WebP, proper sizing, lazy loading
4. **Lighthouse Performance > 85** - Verifiable via CI
5. **Mobile 3G usable** - App functional on slow networks
6. **No layout shift** - CLS < 0.1 on all pages
7. **Realtime stays fast** - Supabase subscriptions optimized

### Measurable Acceptance Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial JS | < 300KB gzipped | Bundle analyzer |
| LCP | < 2.5s | Lighthouse |
| FID | < 100ms | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| Lighthouse Perf | > 85 | CI automation |
| Lighthouse Mobile | > 80 | CI automation |
| 3G TTI | < 5s | WebPageTest |

---

## Hard Boundaries

### Included (In Scope)

1. **Bundle Optimization**
   - Add bundle analyzer
   - Identify largest chunks
   - Implement code splitting
   - Dynamic imports for heavy libs

2. **Image Optimization**
   - Audit all images
   - Convert to WebP where beneficial
   - Implement blur placeholders
   - Ensure proper sizing

3. **Loading States**
   - Add Suspense boundaries
   - Implement skeleton screens
   - Create consistent loading patterns

4. **Performance Monitoring**
   - Set up Lighthouse CI
   - Add performance budgets
   - Core Web Vitals tracking

5. **Mobile-Specific Optimizations**
   - Reduce animation on low-power mode
   - Touch scroll optimization
   - Memory leak prevention

### Explicitly Excluded (Out of Scope)

| Item | Reason | Deferred To |
|------|--------|-------------|
| Service Worker/PWA | Separate feature | v5.0 |
| Offline support | Separate feature | v5.0 |
| Virtual scrolling | Complex implementation | v5.1 |
| CDN optimization | Infrastructure | DevOps |
| Database optimization | Backend concern | Backend team |

---

## Best-Practice Approach

### 1. Bundle Analyzer Setup

**Install & Configure:**

```bash
npm install @next/bundle-analyzer
```

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // existing config
});
```

**Usage:**
```bash
ANALYZE=true npm run build
```

### 2. Code Splitting Strategy

**Priority Matrix:**

| Import | Current Load | Target Load | Savings |
|--------|--------------|-------------|---------|
| recharts | Initial | Dashboard route | ~400KB |
| framer-motion | Initial | Per-component | ~100KB |
| numeral | Initial | On-demand | ~15KB |

**Implementation - Recharts:**

```tsx
// Before: Static import (BROKEN)
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// After: Dynamic import (CORRECT)
import dynamic from 'next/dynamic';

const AreaChart = dynamic(
  () => import('recharts').then(mod => mod.AreaChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const Area = dynamic(
  () => import('recharts').then(mod => mod.Area),
  { ssr: false }
);

// Repeat for all recharts components...
```

**Better Pattern - Wrapper Component:**

```tsx
// components/charts/DynamicAreaChart.tsx
'use client';

import dynamic from 'next/dynamic';
import { ChartSkeleton } from './ChartSkeleton';

// Single dynamic import for all chart functionality
const RechartsAreaChart = dynamic(
  () => import('./AreaChartImpl'),
  {
    ssr: false,
    loading: () => <ChartSkeleton />
  }
);

export { RechartsAreaChart as AreaChart };
```

```tsx
// components/charts/AreaChartImpl.tsx
'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function AreaChartImpl(props) {
  return (
    <ResponsiveContainer width="100%" height={props.height || 300}>
      <AreaChart data={props.data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={props.xKey} />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey={props.dataKey}
          stroke={props.stroke}
          fill={props.fill}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

### 3. Framer Motion Optimization

**Current Issue:** Full library loaded everywhere

**Solution 1 - Tree Shaking (Already Enabled):**
```tsx
// Good - only imports what's needed
import { motion, AnimatePresence } from 'framer-motion';
```

**Solution 2 - Lazy Load Animations:**
```tsx
// For non-critical animations
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false }
);
```

**Solution 3 - Reduce Motion for Accessibility:**
```tsx
// hooks/useReducedMotion.ts
import { useReducedMotion } from 'framer-motion';

export function useOptimizedMotion() {
  const prefersReducedMotion = useReducedMotion();

  return {
    animate: prefersReducedMotion ? false : true,
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.3, ease: 'easeOut' }
  };
}
```

### 4. Image Optimization

**Current State:**
```tsx
// Found in Sidebar.tsx
<Image
  src="/images/ChatGPT Image Jan 16, 2026, 11_30_10 PM.png"
  alt="AI BY SEA"
  fill
  className="object-contain"
  priority
/>
```

**Issues:**
1. PNG format (likely oversized)
2. Generic filename
3. `priority` on sidebar (should be lazy)

**Optimized:**
```tsx
// 1. Convert to WebP
// 2. Rename to semantic name
// 3. Add blur placeholder
// 4. Remove priority from non-LCP images

<Image
  src="/images/logo.webp"
  alt="AI BY SEA"
  fill
  className="object-contain"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."  // Generate with plaiceholder
/>
```

**Image Audit Checklist:**

| Location | Current | Action |
|----------|---------|--------|
| Logo (sidebar) | PNG, priority | WebP, lazy |
| Logo (mobile) | PNG, priority | WebP, keep priority |
| Channel icons | SVG | OK |
| User avatars | Placeholder | OK |
| Dashboard images | Unknown | Audit needed |

### 5. Skeleton Loading Screens

**Pattern:**

```tsx
// components/ui/Skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-slate-700 rounded",
        className
      )}
    />
  );
}

// Usage example
export function ConversationListSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Suspense Boundaries:**

```tsx
// app/(main)/inbox/page.tsx
import { Suspense } from 'react';

export default function InboxPage() {
  return (
    <div className="flex h-full">
      <Suspense fallback={<ConversationListSkeleton />}>
        <ConversationList />
      </Suspense>
      <Suspense fallback={<ChatViewSkeleton />}>
        <ChatView />
      </Suspense>
    </div>
  );
}
```

### 6. Performance Budgets

**next.config.js:**

```js
module.exports = {
  experimental: {
    // Performance budgets (Next.js 14+)
  },

  // Webpack bundle size limits
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 300000, // 300KB
        maxAssetSize: 200000,      // 200KB per chunk
      };
    }
    return config;
  },
};
```

### 7. Lighthouse CI Setup

**.github/workflows/lighthouse.yml:**

```yaml
name: Lighthouse CI
on: [push]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npm run build

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.js'
          uploadArtifacts: true
```

**lighthouserc.js:**

```js
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/inbox',
      ],
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### 8. Mobile-Specific Optimizations

**Reduce Animation on Battery Saver:**

```tsx
// hooks/useBatterySaver.ts
export function useBatterySaver() {
  const [isBatterySaver, setIsBatterySaver] = useState(false);

  useEffect(() => {
    // Check navigator.getBattery() if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setIsBatterySaver(battery.level < 0.2 && !battery.charging);

        battery.addEventListener('levelchange', () => {
          setIsBatterySaver(battery.level < 0.2 && !battery.charging);
        });
      });
    }
  }, []);

  return isBatterySaver;
}
```

**Memory Leak Prevention:**

```tsx
// Common patterns causing leaks

// BAD: Subscription not cleaned up
useEffect(() => {
  supabase.channel('room').subscribe();
}, []);

// GOOD: Cleanup on unmount
useEffect(() => {
  const channel = supabase.channel('room').subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

**Debounce Heavy Operations:**

```tsx
// Search input example
const debouncedSearch = useMemo(
  () => debounce((term: string) => {
    fetchResults(term);
  }, 300),
  []
);

useEffect(() => {
  return () => debouncedSearch.cancel();
}, [debouncedSearch]);
```

### 9. Realtime Optimization

**Current Issues:**
- Multiple subscriptions per page
- No connection pooling
- Potential memory leaks

**Solution - Centralized Subscription Manager:**

```tsx
// lib/supabase/subscriptions.ts
class SubscriptionManager {
  private subscriptions = new Map<string, RealtimeChannel>();

  subscribe(key: string, config: SubscriptionConfig): RealtimeChannel {
    if (this.subscriptions.has(key)) {
      return this.subscriptions.get(key)!;
    }

    const channel = supabase
      .channel(key)
      .on(config.event, config.filter, config.callback)
      .subscribe();

    this.subscriptions.set(key, channel);
    return channel;
  }

  unsubscribe(key: string) {
    const channel = this.subscriptions.get(key);
    if (channel) {
      supabase.removeChannel(channel);
      this.subscriptions.delete(key);
    }
  }

  unsubscribeAll() {
    this.subscriptions.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.subscriptions.clear();
  }
}

export const subscriptionManager = new SubscriptionManager();
```

---

## Edge Cases & Failure Modes

### Critical Edge Cases

| Edge Case | Risk | Mitigation |
|-----------|------|------------|
| Slow 3G connection | HIGH | Skeleton states, progressive loading |
| Large conversation history | HIGH | Pagination, virtualization marker |
| Multiple browser tabs | MEDIUM | Shared subscription manager |
| Memory pressure | MEDIUM | Cleanup subscriptions aggressively |
| Stale bundle cache | MEDIUM | Cache busting, version headers |
| Failed chunk load | MEDIUM | Error boundary with retry |

### Error Boundaries for Chunks

```tsx
// components/ChunkErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ChunkErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <p className="text-red-500 mb-2">Failed to load component</p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Implementation Order & Dependencies

### Dependency Graph

```
Phase 04 (All Pages Responsive) - Complete
    │
    ▼
┌──────────────────────────────────────┐
│ Step 1: Measurement Setup            │
│ - Install bundle analyzer            │
│ - Run baseline Lighthouse            │
│ - Document current metrics           │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 2: Bundle Analysis              │
│ - Generate bundle report             │
│ - Identify largest chunks            │
│ - Plan splitting strategy            │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 3: Code Splitting               │
│ - Dynamic import recharts            │
│ - Split route chunks                 │
│ - Add loading states                 │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 4: Image Optimization           │
│ - Audit all images                   │
│ - Convert to WebP                    │
│ - Add blur placeholders              │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 5: Loading States               │
│ - Skeleton components                │
│ - Suspense boundaries                │
│ - Error boundaries                   │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 6: Performance CI               │
│ - Lighthouse CI setup                │
│ - Performance budgets                │
│ - Automated checks                   │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 7: Polish & Verification        │
│ - Run final Lighthouse               │
│ - Test on real devices               │
│ - Document improvements              │
└──────────────────────────────────────┘
```

### Files to Modify

| File | Changes | Priority |
|------|---------|----------|
| `next.config.js` | Bundle analyzer, budgets | P0 |
| `package.json` | Add analyzer dep | P0 |
| `src/app/(main)/dashboard/page.tsx` | Dynamic recharts | P0 |
| `src/components/layout/Sidebar.tsx` | Image optimization | P1 |
| `src/components/layout/MobileNav.tsx` | Image optimization | P1 |
| `.github/workflows/lighthouse.yml` | CREATE | P1 |
| `lighthouserc.js` | CREATE | P1 |

### New Files to Create

| File | Purpose |
|------|---------|
| `src/components/ui/Skeleton.tsx` | Skeleton loader |
| `src/components/charts/DynamicAreaChart.tsx` | Lazy chart wrapper |
| `src/components/ChunkErrorBoundary.tsx` | Chunk load error handling |
| `src/hooks/useReducedMotion.ts` | Motion preference hook |
| `src/lib/supabase/subscriptions.ts` | Subscription manager |

---

## Cross-Phase Consistency

### Performance Requirements Retroactive

All components from Phases 02-04 must:
- Use skeleton loading states
- Handle chunk load failures gracefully
- Respect reduced motion preferences
- Clean up subscriptions on unmount

### Design Token for Performance

```css
/* Animation durations - can be reduced */
:root {
  --transition-instant: 50ms;
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  --transition-slow: 500ms;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-instant: 0ms;
    --transition-fast: 0ms;
    --transition-normal: 0ms;
    --transition-slow: 0ms;
  }
}
```

---

## Testing Protocol

### Performance Test Matrix

| Test | Tool | Target |
|------|------|--------|
| Bundle size | Bundle analyzer | < 300KB initial |
| Lighthouse desktop | Lighthouse | > 90 perf |
| Lighthouse mobile | Lighthouse | > 85 perf |
| 3G simulation | DevTools | TTI < 5s |
| Memory leak | DevTools | No growth over time |
| CLS | Lighthouse | < 0.1 |

### Real Device Testing

| Device | Network | Test |
|--------|---------|------|
| iPhone SE | 3G | Full app navigation |
| iPhone 14 | 4G | Dashboard load |
| Pixel 7 | 3G | Inbox with 100+ convos |
| iPad | WiFi | All pages |

---

## Success Metrics

After Phase 05 completion:

| Metric | Before | After Target |
|--------|--------|--------------|
| Initial bundle | ~800KB | < 300KB |
| Lighthouse Performance | Unknown | > 85 |
| Lighthouse Mobile | Unknown | > 80 |
| LCP | Unknown | < 2.5s |
| CLS | Unknown | < 0.1 |
| FID | Unknown | < 100ms |
| 3G TTI | Unknown | < 5s |

---

## Sources & References

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Web.dev Performance](https://web.dev/learn/performance/)
- [Core Web Vitals](https://web.dev/articles/vitals)
- [Dynamic Imports in Next.js](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading)
- [Recharts Tree Shaking](https://recharts.org/en-US/guide/getting-started)
- [Framer Motion Reduce Motion](https://www.framer.com/motion/use-reduced-motion/)
