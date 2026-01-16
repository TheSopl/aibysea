# Phase 12: Dark Mode Implementation - Research

**Researched:** 2026-01-16
**Domain:** Tailwind CSS v4 dark mode with Next.js 16 SSR
**Confidence:** HIGH

<research_summary>
## Summary

Researched implementing dark mode with Tailwind CSS v4.1.18 in a Next.js 16 application. The current issue is that Tailwind v4 removed the JavaScript config file approach and requires CSS-based variant definitions.

Key finding: Tailwind v4 uses `@variant dark` directive in CSS instead of `darkMode: 'class'` in config. The toggle mechanism works via CSS variables and `data-theme` or class-based selectors. SSR flash prevention requires an inline blocking script before React hydration.

**Primary recommendation:** Use CSS variables for theme colors + `@variant dark` directive + blocking script in `<head>` to prevent flash + `suppressHydrationWarning` on html element.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | 4.1.18 | CSS framework | Already in use, v4 requires CSS-based config |
| next | 16.1.1 | React framework | Already in use, SSR requires special handling |
| React Context | 19.x | State management | Built-in, no dependencies |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next-themes | 0.3.x | Theme management | Optional - handles SSR, system detection, persistence automatically |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom Context | next-themes | next-themes handles SSR/flash prevention automatically but adds dependency |
| data-theme attribute | class="dark" | Both work, class is simpler but data-theme more semantic |
| CSS variables | Tailwind dark: classes | CSS variables work without Tailwind recompile, more flexible |

**Installation:**
```bash
# Current setup - no additional packages needed
# Optional:
npm install next-themes  # If using the library approach
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
src/
├── context/
│   └── ThemeContext.tsx      # Theme provider with toggle logic
├── components/
│   └── layout/
│       └── TopBar.tsx         # Contains theme toggle button
├── app/
│   ├── layout.tsx             # Root layout with blocking script
│   └── globals.css            # @variant dark directive
```

### Pattern 1: Tailwind v4 CSS Configuration
**What:** Define dark mode variant directly in CSS instead of config file
**When to use:** Always with Tailwind v4
**Example:**
```css
/* app/globals.css */
@import "tailwindcss";

/* Option 1: Class-based (what we currently use) */
@variant dark (&:where(.dark, .dark *));

/* Option 2: Data attribute-based (more semantic) */
@variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

/* CSS variables for theme colors */
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --card-bg: #ffffff;
  --text-primary: #0a0a0a;
}

html.dark {
  --background: #0f172a;
  --foreground: #f8fafc;
  --card-bg: #1e293b;
  --text-primary: #f8fafc;
}
```

### Pattern 2: Blocking Script for Flash Prevention
**What:** Inline script in `<head>` that runs before React hydration
**When to use:** Always with Next.js SSR to prevent theme flash
**Example:**
```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Pattern 3: Theme Context with Proper State Management
**What:** React Context that manages theme state and DOM updates
**When to use:** Always for theme toggle functionality
**Example:**
```typescript
// context/ThemeContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // SSR fallback - prevents errors during prerendering
    return { theme: 'light' as const, toggleTheme: () => {} };
  }
  return context;
}
```

### Anti-Patterns to Avoid
- **Using Tailwind v3 config syntax in v4:** `darkMode: 'class'` in tailwind.config.js doesn't work in v4
- **Not using suppressHydrationWarning:** Causes React hydration warnings when script modifies html
- **Reading localStorage during render:** Causes hydration mismatch, use useEffect only
- **Forgetting SSR fallback in useTheme:** Crashes during Next.js prerendering
- **Using `@tailwind` directives in v4:** Use `@import "tailwindcss"` instead
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme persistence | Custom localStorage wrapper | Built-in localStorage in useEffect | Simple, no need for wrapper |
| Flash prevention | CSS tricks or delays | Blocking inline script | Only reliable way to prevent flash |
| System theme detection | Manual matchMedia | Optional: next-themes library | Handles edge cases, updates on OS change |
| Theme state | useState everywhere | React Context | Centralized state, no prop drilling |

**Key insight:** The blocking script pattern is the ONLY reliable way to prevent flash of wrong theme in SSR. CSS tricks, delays, or opacity transitions all show the wrong theme briefly. The script must run before any React code.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Tailwind Classes Not Generating
**What goes wrong:** `dark:` variants don't work, no dark mode styles applied
**Why it happens:** Missing `@variant dark` directive in globals.css (Tailwind v4 requirement)
**How to avoid:** Always add `@variant dark (&:where(.dark, .dark *));` in CSS
**Warning signs:** Console shows no errors but dark: classes have no effect

### Pitfall 2: Theme Flash on Page Load
**What goes wrong:** Page loads in light mode then flashes to dark
**Why it happens:** Theme applied after React hydration instead of before
**How to avoid:** Use blocking inline script in <head> before body
**Warning signs:** Brief flash of wrong colors on every page load

### Pitfall 3: Hydration Mismatch Errors
**What goes wrong:** React warnings about server/client HTML mismatch
**Why it happens:** Server renders without theme, client renders with theme from localStorage
**How to avoid:** Add `suppressHydrationWarning` to html element + SSR fallback in useTheme
**Warning signs:** Console errors: "Text content does not match server-rendered HTML"

### Pitfall 4: Toggle Button Updates But Colors Don't Change
**What goes wrong:** Theme state changes but UI stays same
**Why it happens:** DOM class not actually being updated, or CSS variables not defined
**How to avoid:** Verify document.documentElement.classList in useEffect runs, check CSS variables exist
**Warning signs:** Icon changes but page colors remain the same
</common_pitfalls>

<code_examples>
## Code Examples

### Complete Working Setup

#### 1. CSS Configuration (globals.css)
```css
/* Source: Tailwind v4 official docs + our implementation */
@import "tailwindcss";

/* Enable dark mode variant */
@variant dark (&:where(.dark, .dark *));

/* Theme color variables */
:root {
  --background: #F5F6FA;
  --foreground: #1a1a1a;
  --card-bg: #ffffff;
  --card-border: #e5e7eb;
  --text-primary: #1a1a1a;
  --text-secondary: #6b7280;
}

html.dark {
  --background: #0f172a;
  --foreground: #f8fafc;
  --card-bg: #1e293b;
  --card-border: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
}

body {
  background: var(--background);
  color: var(--foreground);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

#### 2. Root Layout with Blocking Script (app/layout.tsx)
```tsx
/* Source: Next.js dark mode best practices */
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### 3. Theme Toggle Button Component
```tsx
/* Source: Our implementation */
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-gray-600" />
      ) : (
        <Sun size={20} className="text-yellow-400" />
      )}
    </button>
  );
}
```

#### 4. Using Theme Colors in Components
```tsx
/* Approach 1: Tailwind dark: classes */
<div className="bg-white dark:bg-slate-800 text-black dark:text-white">
  Content
</div>

/* Approach 2: CSS variables (more flexible) */
<div style={{
  backgroundColor: 'var(--card-bg)',
  color: 'var(--text-primary)'
}}>
  Content
</div>

/* Approach 3: Mix both (recommended) */
<div className="rounded-lg p-4 bg-white dark:bg-slate-800">
  <h2 style={{ color: 'var(--text-primary)' }}>Title</h2>
  <p className="text-gray-600 dark:text-slate-300">Description</p>
</div>
```
</code_examples>

<sota_updates>
## State of the Art (2024-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js darkMode | @variant dark in CSS | Tailwind v4 (2024) | Config file removed, all in CSS now |
| @tailwind directives | @import "tailwindcss" | Tailwind v4 | Cleaner syntax, single import |
| class="dark" only | class or data-theme | Tailwind v4 | More flexibility in selector |
| CSS-in-JS for themes | CSS variables | 2023+ | Better performance, no runtime |

**New patterns to consider:**
- **CSS variables for all theme colors:** More flexible than Tailwind classes alone, works across Tailwind and custom CSS
- **data-theme attribute:** More semantic than class="dark", easier to support multiple themes
- **System theme detection with matchMedia:** Auto-sync with OS theme changes

**Deprecated/outdated:**
- **Tailwind v3 config-based dark mode:** Removed in v4, use @variant directive
- **@tailwind base/components/utilities:** Use single @import "tailwindcss" instead
- **ThemeProvider without SSR handling:** Causes hydration errors in Next.js
</sota_updates>

<open_questions>
## Open Questions

1. **Multiple theme support (not just light/dark)**
   - What we know: CSS variables support unlimited themes
   - What's unclear: Best pattern for >2 themes (system, light, dark, custom)
   - Recommendation: Start with light/dark, add system detection in Phase 12 if time permits

2. **Theme transition animations**
   - What we know: CSS transitions work on color properties
   - What's unclear: Whether smooth transitions improve or hurt UX
   - Recommendation: Add simple transition on body background/color, test user feedback
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 Dark Mode Documentation](https://tailwindcss.com/docs/dark-mode) - Official docs on @variant directive
- [Tailwind CSS v4 GitHub Discussion #15083](https://github.com/tailwindlabs/tailwindcss/discussions/15083) - CSS variables usage
- [Things About Web: Dark Mode with Tailwind v4 and Next.js](https://www.thingsaboutweb.dev/en/posts/dark-mode-with-tailwind-v4-nextjs) - Complete implementation guide

### Secondary (MEDIUM confidence)
- [Medium: Theme Colors with Tailwind v4 and Next Themes](https://medium.com/@kevstrosky/theme-colors-with-tailwind-css-v4-0-and-next-themes-dark-light-custom-mode-36dca1e20419) - next-themes integration patterns
- [Not A Number: Fixing Dark Mode Flickering in React/Next.js](https://notanumber.in/blog/fixing-react-dark-mode-flickering) - Flash prevention techniques
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) - Library approach with SSR support

### Tertiary (LOW confidence - needs validation)
- None - all approaches verified against official Tailwind docs and Next.js patterns
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Tailwind CSS v4.1.18 dark mode configuration
- Ecosystem: Next.js 16 SSR considerations
- Patterns: CSS variables, blocking scripts, theme context
- Pitfalls: Flash prevention, hydration mismatches, Tailwind v4 migration

**Confidence breakdown:**
- Standard stack: HIGH - We're already using Tailwind v4 and Next.js 16
- Architecture: HIGH - Patterns verified with official docs and working examples
- Pitfalls: HIGH - Documented from our actual implementation issues
- Code examples: HIGH - Extracted from official sources and our codebase

**Research date:** 2026-01-16
**Valid until:** 2026-02-16 (30 days - Tailwind CSS v4 stable, patterns unlikely to change)
</metadata>

---

*Phase: 12-dark-mode-implementation*
*Research completed: 2026-01-16*
*Ready for planning: yes*
