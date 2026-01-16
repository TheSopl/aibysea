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
    // Get theme from localStorage or default to light
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      setTheme(stored);
      if (stored === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    console.log('🎨 Toggle theme called, current theme:', theme);
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      console.log('🎨 Switching to:', newTheme);
      localStorage.setItem('theme', newTheme);

      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        console.log('🎨 Added dark class to html');
      } else {
        document.documentElement.classList.remove('dark');
        console.log('🎨 Removed dark class from html');
      }

      console.log('🎨 HTML classes:', document.documentElement.className);
      return newTheme;
    });
  };

  // Don't wait for mount to provide context
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return default values if not in provider (for SSR/prerendering)
    return { theme: 'light' as const, toggleTheme: () => {} };
  }
  return context;
}
