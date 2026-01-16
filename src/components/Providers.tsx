'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { CommandPalette } from './CommandPalette';
import { GlobalSearch } from './GlobalSearch';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CommandPalette />
        <GlobalSearch />
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
