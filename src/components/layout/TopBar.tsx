'use client';

import { useState } from 'react';
import { Search, Bell, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <div className="h-14 md:h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-3 md:px-6 flex items-center justify-between transition-colors duration-300">
      {/* Page Title - hidden when mobile search is open */}
      <h1 className={`text-lg md:text-2xl font-bold text-dark dark:text-white truncate ${showMobileSearch ? 'hidden' : ''}`}>
        {title}
      </h1>

      {/* Search Bar - Desktop */}
      <div className="hidden md:block flex-1 max-w-2xl mx-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search conversations, AI agents, contacts..."
            className="w-full pl-12 pr-4 py-2.5 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-dark dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Mobile Search Bar - Full width when open */}
      {showMobileSearch && (
        <div className="flex-1 md:hidden mr-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="w-full pl-10 pr-4 py-2 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-dark dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-1 md:gap-4">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden p-2 hover:bg-light-bg dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          {showMobileSearch ? (
            <X size={20} className="text-text-secondary dark:text-slate-400" />
          ) : (
            <Search size={20} className="text-text-secondary dark:text-slate-400" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-light-bg dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Toggle dark mode"
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

        {/* User Menu - Hidden on mobile (shown in mobile nav) */}
        <button className="hidden md:flex items-center gap-3 p-2 hover:bg-light-bg dark:hover:bg-slate-700 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-sm">
            R
          </div>
        </button>
      </div>
    </div>
  );
}
