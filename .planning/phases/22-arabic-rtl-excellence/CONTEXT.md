# Phase 22: Arabic & RTL Excellence — Context

**Goal:** Complete Arabic translation coverage, audit and fix RTL layout issues, implement locale-aware date/number formatting, verify Arabic font loading.

**Source:** [codebase/CONCERNS.md](../../codebase/CONCERNS.md) — Arabic / RTL Implementation Issues (lines 65-122)

---

## 🌍 Critical Issues to Fix

### 1. Translation Files Missing or Incomplete
**Current State:**
- Cannot locate `messages/en.json` or `messages/ar.json` files
- Translation coverage unknown
- Hardcoded strings likely exist

**From CONCERNS.md:**
```
### Translation Files Missing or Not Detected
- Issue: No messages/en.json or messages/ar.json files found
- Files: Expected in messages/ directory (not detected)
- Impact: Cannot verify translation coverage, hardcoded strings may exist
- Fix approach:
  - Locate actual translation files (check messages/, locales/, src/i18n/)
  - If missing: Create comprehensive translation files for all UI strings
  - Validate 100% translation coverage for both EN and AR
```

**Action required:**
1. Search for existing translation files (may be in different location)
2. If missing: Extract all UI strings and create translation files
3. Validate 100% coverage for both EN and AR

---

### 2. Hardcoded English Strings Suspected
**Current State:**
- Components import translation hooks but may have hardcoded fallback strings
- No systematic audit performed
- Arabic users likely see English text in places

**From CONCERNS.md:**
```
### Hardcoded English Strings Suspected
- Issue: Several components import translation hooks but may have fallback hardcoded strings
- Files:
  - src/components/dashboard/Navigation.tsx
  - src/components/layout/Sidebar.tsx (uses nameKey pattern - GOOD)
  - src/components/Breadcrumbs.tsx
  - Need full audit to find hardcoded strings
- Impact: Arabic users see English text in places
- Fix approach:
  - Grep for English strings not in translation files
  - Replace all hardcoded strings with t('key') pattern
  - Add ESLint rule to detect hardcoded user-facing strings
```

**Audit strategy:**
1. Search for string literals in JSX: `grep -r '"[A-Z].*"' src/`
2. Identify user-facing strings vs code constants
3. Extract to translation files
4. Replace with `t('key')` pattern

---

### 3. RTL Layout Issues (Potential)
**Current State:**
- Logical properties (ms/me, ps/pe) introduced in Phase 18.1 but may not be everywhere
- Physical properties (left/right) may still exist in some components
- Full RTL audit not performed

**From CONCERNS.md:**
```
### RTL Layout Issues (Potential)
- Issue: Logical properties (ms/me, ps/pe) may not be used everywhere
- Files: Need audit of src/components/**/*.tsx for physical CSS properties (left/right)
- Impact: Some UI elements may not flip correctly in Arabic mode
- Fix approach:
  - Audit all components for left/right usage
  - Replace: ml-*, mr-*, pl-*, pr-* → ms-*, me-*, ps-*, pe-*
  - Preserve left/right only for fixed positioning (sidebar left-0 is correct)
  - Test entire app in Arabic mode for visual issues
```

**RTL conversion rules:**
- `ml-4` → `ms-4` (margin-start)
- `mr-4` → `me-4` (margin-end)
- `pl-4` → `ps-4` (padding-start)
- `pr-4` → `pe-4` (padding-end)
- Keep `left-0`, `right-0` for fixed positioning (sidebar)

**From STATE.md (Phase 18.1-03 decisions):**
```
- Use Tailwind logical properties (start/end, ms/me, ps/pe) for RTL support throughout
- Preserve left-0 for fixed desktop sidebar (physical positioning, not logical)
```

---

### 4. Arabic Font Loading Not Verified
**Current State:**
- IBM Plex Sans Arabic configured in layout but loading not confirmed
- Font loading can fail silently
- Arabic text may render with fallback fonts (poor readability)

**From CONCERNS.md:**
```
### Arabic Font Loading Not Verified
- Issue: IBM Plex Sans Arabic configured in layout but loading not confirmed
- Files: src/app/[locale]/layout.tsx (lines 22-27)
- Impact: Arabic text may render with fallback fonts (poor readability)
- Fix approach:
  - Test Arabic pages to verify font rendering
  - Check browser DevTools for font loading errors
  - Add font-display: swap for better loading UX
  - Consider font preloading for critical Arabic pages
```

**Font configuration location:**
- `src/app/[locale]/layout.tsx` — IBM Plex Sans Arabic import

**Testing approach:**
1. Open Arabic pages in browser
2. DevTools → Network → Filter by font
3. Verify `IBMPlexSansArabic-*.woff2` loads
4. Check computed font family in Elements panel

---

### 5. Date/Number Formatting for Arabic Locale
**Current State:**
- No locale-aware formatting detected
- Uses numeral.js but no locale config found
- Arabic users see English-style dates and numbers

**From CONCERNS.md:**
```
### Date/Number Formatting for Arabic Locale
- Issue: No locale-aware formatting detected for dates and numbers
- Files: Uses numeral.js (number formatting lib) but no locale config found
- Impact: Arabic users see English-style dates (MM/DD/YYYY) and numbers
- Fix approach:
  - Use next-intl's formatting functions for dates/numbers
  - Configure Arabic number formatting (Eastern Arabic numerals vs Western)
  - Test all date/number displays in Arabic mode
```

**Required changes:**
- Dates: Use `next-intl` DateTimeFormat (supports DD/MM/YYYY for Arabic)
- Numbers: Configure Arabic numeral style (Eastern Arabic: ٠١٢٣ vs Western: 0123)
- Currency: Configure Arabic currency formatting

---

## 📁 Files to Modify

### Translation Files (Create/Update)
```
messages/en.json           # Complete English translations
messages/ar.json           # Complete Arabic translations
src/i18n/request.ts        # May need to verify config
```

### Components to Audit
```
src/components/dashboard/Navigation.tsx
src/components/layout/Sidebar.tsx
src/components/layout/TopBar.tsx
src/components/layout/BottomNav.tsx
src/components/Breadcrumbs.tsx
... (all components in src/components/)
```

### Pages to Audit (All 25+ pages)
```
src/app/[locale]/(main)/dashboard/page.tsx
src/app/[locale]/(main)/inbox/page.tsx
src/app/[locale]/(main)/agents/page.tsx
... (all pages)
```

### Font Configuration
```
src/app/[locale]/layout.tsx        # Verify Arabic font loading
next.config.js                     # May need font optimization config
```

### Formatting Utilities (Create)
```
src/lib/i18n/formatters.ts        # Locale-aware formatters
src/lib/i18n/arabic-numerals.ts   # Eastern Arabic numeral support (optional)
```

---

## 🔧 Technical Approach

### Translation Audit Process
**Step 1: Find existing translation files**
```bash
find . -name "*.json" -path "*/messages/*"
find . -name "*.json" -path "*/locales/*"
find . -name "en.json" -o -name "ar.json"
```

**Step 2: Extract all UI strings**
```bash
# Find potential hardcoded strings in JSX
grep -r -E '>[A-Z][^<]*<' src/ --include="*.tsx"
grep -r -E '\"[A-Z][a-zA-Z\s]{5,}\"' src/ --include="*.tsx"
```

**Step 3: Create translation structure**
```json
// messages/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "dashboard": {
    "title": "Dashboard",
    "welcomeMessage": "Welcome back"
  },
  "inbox": {
    "title": "Inbox",
    "noMessages": "No messages yet"
  }
}
```

### RTL Audit Script
```bash
# Find all physical directional properties
grep -r -E "(ml-|mr-|pl-|pr-|left-|right-)[0-9]" src/ --include="*.tsx" \
  | grep -v "left-0" \  # Exclude fixed positioning
  | grep -v "right-0"
```

### Locale-Aware Formatting
```typescript
// src/lib/i18n/formatters.ts
import { useFormatter } from 'next-intl'

export function useLocalizedDate() {
  const format = useFormatter()

  return {
    formatDate: (date: Date) => format.dateTime(date, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    formatShortDate: (date: Date) => format.dateTime(date, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }
}

export function useLocalizedNumber() {
  const format = useFormatter()

  return {
    formatNumber: (num: number) => format.number(num),
    formatCurrency: (amount: number) => format.number(amount, {
      style: 'currency',
      currency: 'SAR' // Saudi Riyal for Arabic
    })
  }
}
```

---

## 🎯 Success Criteria

Phase 22 is complete when:

- [ ] **Translations:**
  - [ ] `messages/en.json` created with 100% coverage
  - [ ] `messages/ar.json` created with 100% coverage
  - [ ] Zero hardcoded English strings in components
  - [ ] All pages render fully in Arabic
  - [ ] Translation keys organized by feature/page

- [ ] **RTL Layout:**
  - [ ] All physical properties (ml/mr/pl/pr) converted to logical (ms/me/ps/pe)
  - [ ] Fixed positioning preserved where needed (sidebar left-0)
  - [ ] Full app tested in Arabic mode
  - [ ] Zero layout bugs in RTL mode

- [ ] **Arabic Font:**
  - [ ] IBM Plex Sans Arabic loading verified
  - [ ] Font displays correctly on all pages
  - [ ] No font loading errors in DevTools
  - [ ] Font preloading configured (optional optimization)

- [ ] **Locale Formatting:**
  - [ ] All dates formatted with locale awareness
  - [ ] All numbers formatted with locale awareness
  - [ ] Currency formatted for Arabic locale
  - [ ] Relative time formatting (e.g., "2 hours ago") works in Arabic

- [ ] **Visual QA:**
  - [ ] Manual review of all pages in Arabic mode
  - [ ] Screenshots taken for regression testing
  - [ ] Mobile + desktop RTL testing complete
  - [ ] No text overflow or alignment issues

---

## 📚 Related Documentation

**Codebase analysis:**
- [codebase/CONCERNS.md](../../codebase/CONCERNS.md) — Arabic/RTL Issues (lines 65-122)
- [codebase/CONVENTIONS.md](../../codebase/CONVENTIONS.md) — RTL patterns established

**Phase 18.1 work (completed):**
- [archive/v4.0-mobile/18.1-internationalization/](../../archive/v4.0-mobile/18.1-internationalization/) — Initial i18n setup
- STATE.md Phase 18.1 decisions — RTL strategy, font choices

**External resources:**
- next-intl: https://next-intl-docs.vercel.app/
- Tailwind RTL: https://tailwindcss.com/docs/responsive-design#using-logical-properties
- IBM Plex Sans Arabic: https://fonts.google.com/specimen/IBM+Plex+Sans+Arabic

**Prior decisions (STATE.md):**
- Phase 18.1-01: next-intl with localePrefix: 'as-needed'
- Phase 18.1-01: IBM Plex Sans Arabic font chosen
- Phase 18.1-01: All pages moved to [locale] dynamic segment
- Phase 18.1-03: Turkish removed, only EN/AR supported
- Phase 18.1-03: Tailwind logical properties for RTL

---

## 🚧 Blockers & Dependencies

**Depends on:**
- Phase 20 complete (tests help catch translation regressions)
- Phase 21 complete (unified components easier to translate)

**Blocks:**
- None (can work in parallel with Phase 23-24)

**Risks:**
- Translation quality (need native Arabic speaker review)
- RTL edge cases hard to find without extensive testing
- Eastern Arabic numerals may confuse some users (cultural preference)

**Mitigation:**
- Partner with native Arabic speaker for translation review
- Comprehensive visual QA in Arabic mode
- Consider configuring Western numerals for Arabic (user preference)

---

## 💡 Planning Notes

**Suggested plan breakdown:**
1. **22-01:** Translation Audit & Creation (extract strings, create messages files, verify coverage)
2. **22-02:** RTL Layout Fixes & Font Verification (audit physical properties, convert to logical, test Arabic font)
3. **22-03:** Locale Formatting & Visual QA (date/number formatters, full app Arabic testing)

**Or combine into 2 plans:**
1. **22-01:** Translations & RTL (complete translation files + RTL audit + conversion)
2. **22-02:** Formatting & QA (locale formatters + font verification + visual testing)

**Estimated complexity:** Medium (systematic work, needs thorough testing)

**Testing strategy:**
- Automated: Test all pages render in Arabic without errors
- Visual: Screenshot comparison EN vs AR
- Manual: Native speaker review of translations
- Functional: All features work correctly in RTL mode

---

*Context prepared: 2026-02-02*
*Ready for: /gsd:plan-phase 22*
