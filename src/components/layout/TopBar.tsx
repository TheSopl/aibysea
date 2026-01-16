'use client';

import { Search, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 flex items-center justify-between transition-colors duration-300">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-dark dark:text-white">{title}</h1>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search conversations, AI agents, contacts..."
            className="w-full pl-12 pr-4 py-2.5 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-dark dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Dark mode test - remove after verification */}
        <div className="bg-white dark:bg-slate-800 text-black dark:text-white px-3 py-1 rounded border border-gray-200 dark:border-slate-600 text-sm">
          Theme: {theme}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-light-bg dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Toggle dark mode (⌘T)"
        >
          {theme === 'light' ? (
            <Moon size={20} className="text-text-secondary dark:text-slate-400" />
          ) : (
            <Sun size={20} className="text-yellow-500" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-light-bg dark:hover:bg-slate-700 rounded-lg transition-colors">
          <Bell size={20} className="text-text-secondary dark:text-slate-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red rounded-full"></span>
        </button>

        {/* User Menu */}
        <button className="flex items-center gap-3 p-2 hover:bg-light-bg dark:hover:bg-slate-700 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-sm">
            R
          </div>
        </button>
      </div>
    </div>
  );
}
