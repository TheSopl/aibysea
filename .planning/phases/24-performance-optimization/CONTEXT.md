# Phase 24: Performance Optimization — Context

**Goal:** Implement code splitting for heavy dependencies (Recharts), fix N+1 queries, optimize images, add Lighthouse CI, monitor Core Web Vitals.

**Source:** [codebase/CONCERNS.md](../../codebase/CONCERNS.md) — Performance Bottlenecks (lines 259-308)

---

## ⚡ Critical Issues to Fix

### 1. No Code Splitting for Large Dependencies
**Current State:**
- Recharts (charting library) loaded on all pages via static import
- Large bundle size impacts initial page load
- No lazy loading for heavy components

**From CONCERNS.md:**
```
### No Code Splitting for Large Dependencies
- Issue: Recharts (charting library) loaded on all pages, not lazy-loaded
- Files: src/components/dashboard/LatencyChart.tsx (imports recharts)
- Impact: Larger initial bundle size, slower page loads
- Fix approach:
  - Dynamic import: const LatencyChart = dynamic(() => import('./LatencyChart'), { ssr: false })
  - Code-split dashboard widgets
  - Measure bundle size with next/bundle-analyzer
```

**Recharts usage location:**
- `src/components/dashboard/LatencyChart.tsx`
- Only used on Dashboard page
- Should be lazy-loaded

**Bundle analysis needed:**
- Install `@next/bundle-analyzer`
- Identify other heavy dependencies
- Code-split appropriately

---

### 2. Potential N+1 Query Pattern
**Current State:**
- Inbox page likely fetches conversations, then messages separately
- Suspected N+1 query in conversation list
- Slow inbox loading with many conversations

**From CONCERNS.md:**
```
### Potential N+1 Query Pattern
- Issue: Inbox page fetches conversations, then messages for each (suspected)
- Files: src/app/[locale]/(main)/inbox/page.tsx
- Impact: Slow inbox loading with many conversations
- Fix approach:
  - Use Supabase joins to fetch conversations + latest message in one query
  - Paginate conversations (limit 50, lazy load more)
  - Cache frequently accessed data
```

**Current query pattern (suspected):**
```typescript
// BAD: N+1 queries
const conversations = await supabase.from('conversations').select('*')
for (const conv of conversations) {
  const messages = await supabase.from('messages')
    .select('*')
    .eq('conversation_id', conv.id)
}
```

**Optimized pattern:**
```typescript
// GOOD: Single query with join
const { data } = await supabase
  .from('conversations')
  .select(`
    *,
    messages (
      id,
      content,
      created_at
    )
  `)
  .order('last_message_at', { ascending: false })
  .limit(50)
```

---

### 3. Real-time Subscriptions Without Cleanup
**Current State:**
- Supabase real-time subscriptions may not unsubscribe properly
- Memory leaks possible with long-running sessions
- Duplicate subscriptions suspected

**From CONCERNS.md:**
```
### Real-time Subscriptions Without Cleanup
- Issue: Supabase subscriptions may not unsubscribe properly
- Files: Client components with real-time (MessageListClient, etc.)
- Impact: Memory leaks, duplicate subscriptions, performance degradation
- Fix approach:
  - Audit all useEffect hooks with Supabase subscriptions
  - Ensure return cleanup: return () => { channel.unsubscribe() }
  - Test for memory leaks in dev (React DevTools Profiler)
```

**Pattern to audit:**
```typescript
// BAD: No cleanup
useEffect(() => {
  const channel = supabase.channel('messages').subscribe(...)
}, [])

// GOOD: Proper cleanup
useEffect(() => {
  const channel = supabase.channel('messages').subscribe(...)
  return () => { channel.unsubscribe() }
}, [])
```

**Files to audit:**
- `src/components/MessageListClient.tsx` (likely location)
- Any component using `supabase.channel()`

---

### 4. No Image Optimization
**Current State:**
- New logo assets added recently without optimization
- May be using `<img>` tags instead of Next.js `<Image>`
- No blur placeholders, no proper sizing

**From CONCERNS.md:**
```
### No Image Optimization
- Issue: New logo assets added (public/aibysea-logo-full.png, public/new-login-logo.png) but optimization unknown
- Impact: Slow page loads if images are large/unoptimized
- Fix approach:
  - Use Next.js <Image> component for all images
  - Optimize images: WebP format, proper sizing
  - Add blur placeholders for better perceived performance
```

**Recent assets:**
- `public/aibysea-logo-full.png`
- `public/new-login-logo.png`

**Optimization checklist:**
1. Convert to WebP format (if not already)
2. Use Next.js `<Image>` component
3. Specify width/height for layout shift prevention
4. Add blur placeholders

---

### 5. Missing Lighthouse/Performance Audits
**Current State:**
- No performance monitoring
- No Lighthouse CI in pipeline
- Core Web Vitals not tracked
- Performance regressions go unnoticed

**From CONCERNS.md:**
```
### Missing Lighthouse/Performance Audits
- Issue: No performance monitoring detected
- Impact: Performance regressions go unnoticed
- Fix approach:
  - Add Lighthouse CI to GitHub Actions
  - Set performance budgets (FCP < 1.8s, LCP < 2.5s, TTI < 3.8s)
  - Monitor Core Web Vitals in production (Vercel Analytics)
```

**Core Web Vitals targets:**
- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **TTI** (Time to Interactive): < 3.8s
- **CLS** (Cumulative Layout Shift): < 0.1
- **FID** (First Input Delay): < 100ms

---

## 📁 Files to Create/Modify

### Code Splitting
```
src/components/dashboard/LatencyChart.tsx        # MODIFY: Add dynamic import
src/app/[locale]/(main)/dashboard/page.tsx       # MODIFY: Lazy load chart
next.config.js                                   # ADD: Bundle analyzer plugin
```

### Query Optimization
```
src/app/[locale]/(main)/inbox/page.tsx           # MODIFY: Optimize queries
src/lib/queries/conversations.ts                 # NEW: Optimized query helpers
```

### Real-time Cleanup
```
src/components/MessageListClient.tsx             # MODIFY: Add cleanup
... (audit all components with real-time)
```

### Image Optimization
```
src/app/[locale]/layout.tsx                      # MODIFY: Use <Image> for logos
src/app/[locale]/login/page.tsx                  # MODIFY: Optimize login images
... (all pages with images)
```

### Performance Monitoring
```
.github/workflows/lighthouse.yml                 # NEW: Lighthouse CI
.lighthouserc.js                                 # NEW: Lighthouse config
next.config.js                                   # MODIFY: Add Vercel Analytics
```

---

## 🔧 Technical Approach

### Code Splitting Strategy
**Dynamic imports:**
```typescript
// src/app/[locale]/(main)/dashboard/page.tsx
import dynamic from 'next/dynamic'

const LatencyChart = dynamic(
  () => import('@/components/dashboard/LatencyChart'),
  {
    ssr: false, // Charts don't need SSR
    loading: () => <ChartSkeleton />
  }
)
```

**Bundle analysis:**
```bash
# Install
npm install @next/bundle-analyzer

# Analyze
ANALYZE=true npm run build
```

**Targets:**
- Main bundle < 200 KB (gzipped)
- Route-specific bundles < 50 KB each
- Third-party code < 100 KB

---

### Query Optimization Patterns
**Inbox optimization:**
```typescript
// src/lib/queries/conversations.ts
export async function getConversationsWithLastMessage(limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      id,
      contact_name,
      contact_number,
      channel,
      last_message_at,
      unread_count,
      messages!inner (
        id,
        content,
        created_at,
        role
      )
    `)
    .order('last_message_at', { ascending: false })
    .limit(1, { foreignTable: 'messages' }) // Only latest message
    .range(offset, offset + limit - 1)

  return data
}
```

**Pagination strategy:**
- Initial load: 50 conversations
- Infinite scroll: Load 20 more on scroll
- Cache previous pages (React Query or SWR)

---

### Real-time Subscription Audit
**Pattern to enforce:**
```typescript
useEffect(() => {
  const channel = supabase
    .channel('messages')
    .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      },
      handleNewMessage
    )
    .subscribe()

  // CRITICAL: Always cleanup
  return () => {
    channel.unsubscribe()
  }
}, [/* dependencies */])
```

**Memory leak detection:**
- Use React DevTools Profiler
- Monitor subscription count over time
- Test: Navigate away and back multiple times

---

### Image Optimization Checklist
**For each image:**
```tsx
import Image from 'next/image'

// BEFORE
<img src="/aibysea-logo-full.png" alt="Logo" />

// AFTER
<Image
  src="/aibysea-logo-full.png"
  alt="AI BY SEA Logo"
  width={200}
  height={50}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/..." // Generate with plaiceholder
/>
```

**Image optimization pipeline:**
1. Convert to WebP: `cwebp input.png -o output.webp`
2. Generate blur placeholder: Use `plaiceholder` library
3. Update all `<img>` tags to `<Image>`
4. Verify no CLS (layout shift)

---

### Lighthouse CI Configuration
```javascript
// .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/inbox'
      ],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}
```

---

## 🎯 Success Criteria

Phase 24 is complete when:

- [ ] **Code Splitting:**
  - [ ] Recharts dynamically imported
  - [ ] Bundle size reduced by 30%+
  - [ ] Route-specific bundles < 50 KB each
  - [ ] No unnecessary dependencies in main bundle

- [ ] **Query Optimization:**
  - [ ] N+1 queries eliminated (inbox, dashboard)
  - [ ] Single query with joins for conversations
  - [ ] Pagination implemented (50 initial, 20 per scroll)
  - [ ] Query response time < 200ms

- [ ] **Real-time Cleanup:**
  - [ ] All subscriptions have cleanup functions
  - [ ] No memory leaks detected
  - [ ] Subscription count stable over time
  - [ ] Reconnection logic works correctly

- [ ] **Image Optimization:**
  - [ ] All images using `<Image>` component
  - [ ] Images converted to WebP
  - [ ] Blur placeholders added
  - [ ] Zero CLS from images

- [ ] **Performance Monitoring:**
  - [ ] Lighthouse CI running on all PRs
  - [ ] Performance budgets enforced
  - [ ] Vercel Analytics configured
  - [ ] Core Web Vitals tracked in production

- [ ] **Performance Targets Met:**
  - [ ] FCP < 1.8s
  - [ ] LCP < 2.5s
  - [ ] TTI < 3.8s
  - [ ] CLS < 0.1
  - [ ] Lighthouse score ≥ 90

---

## 📚 Related Documentation

**Codebase analysis:**
- [codebase/CONCERNS.md](../../codebase/CONCERNS.md) — Performance Bottlenecks (lines 259-308)
- [codebase/ARCHITECTURE.md](../../codebase/ARCHITECTURE.md) — Current architecture patterns

**External resources:**
- Next.js Performance: https://nextjs.org/docs/app/building-your-application/optimizing
- Next.js Image: https://nextjs.org/docs/app/api-reference/components/image
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci
- Core Web Vitals: https://web.dev/vitals/
- Bundle Analyzer: https://www.npmjs.com/package/@next/bundle-analyzer

**Prior decisions (STATE.md):**
- Phase 17-02: Recharts ResponsiveContainer pattern (now needs optimization)
- Real-time patterns established in Phase 6

---

## 🚧 Blockers & Dependencies

**Depends on:**
- Phase 20 complete (tests help catch performance regressions)
- Phase 23 complete (real data for realistic performance testing)

**Blocks:**
- None (can work in parallel with Phase 25-26)

**Risks:**
- Code splitting may break if not tested thoroughly
- Query optimization may introduce bugs if joins are complex
- Image optimization requires build-time processing
- Lighthouse CI can be flaky (need retries)

**Mitigation:**
- Comprehensive testing after each optimization
- Monitor production after deployment
- Gradual rollout of optimizations
- Keep old code commented for easy rollback

---

## 💡 Planning Notes

**Suggested plan breakdown:**
1. **24-01:** Code Splitting & Bundle Optimization (dynamic imports, bundle analysis)
2. **24-02:** Query & Real-time Optimization (N+1 fixes, subscription cleanup)
3. **24-03:** Image Optimization & Performance Monitoring (Next.js Image, Lighthouse CI, Vercel Analytics)

**Or combine into 2 plans:**
1. **24-01:** Application Optimization (code splitting + queries + real-time + images)
2. **24-02:** Performance Infrastructure (Lighthouse CI + Vercel Analytics + monitoring)

**Estimated complexity:** Medium (many small optimizations, testing critical)

**Testing strategy:**
- Benchmark before/after for each optimization
- Lighthouse scores on staging before/after
- Production monitoring for 48 hours post-deployment
- Rollback plan if performance degrades

**Measurement tools:**
- Chrome DevTools Performance tab
- React DevTools Profiler
- Lighthouse (local + CI)
- Vercel Analytics (production)
- Bundle analyzer output

---

*Context prepared: 2026-02-02*
*Ready for: /gsd:plan-phase 24*
