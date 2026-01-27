'use client';

import { useState } from 'react';
import { Search, Bell, Moon, Sun, X, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageToggle from '@/components/LanguageToggle';

interface TopBarProps {
  title: string;
  showBackButton?: boolean;
  backHref?: string;
}

export default function TopBar({ title, showBackButton = false, backHref }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const router = useRouter();
  const t = useTranslations('TopBar');

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="sticky top-0 z-30 h-14 md:h-16 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 px-3 md:px-6 flex items-center justify-between transition-all duration-300">
      {/* Back Button + Page Title */}
      <div className={`flex items-center gap-2 ${showMobileSearch ? 'hidden' : ''}`}>
        {showBackButton && (
          <button
            onClick={handleBack}
            className="lg:hidden p-2 -ms-2 hover:bg-light-bg dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-dark dark:text-white" />
          </button>
        )}
        <h1 className="text-lg md:text-2xl font-bold text-dark dark:text-white truncate">
          {title}
        </h1>
      </div>

      {/* Search Bar - Desktop */}
      <div className="hidden md:block flex-1 max-w-2xl mx-8">
        <div className="relative">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-slate-500" size={20} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full ps-12 pe-4 py-2.5 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-dark dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Mobile Search Bar - Full width when open */}
      {showMobileSearch && (
        <div className="flex-1 md:hidden me-2">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="w-full ps-10 pe-4 py-2 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-dark dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
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

        {/* Language Toggle */}
        <div className="hidden md:block">
          <LanguageToggle />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-light-bg dark:hover:bg-slate-700 rounded-lg transition-colors"
          title={t('toggleDarkMode')}
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
          <span className="absolute top-1 end-1 w-2 h-2 bg-red rounded-full"></span>
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
