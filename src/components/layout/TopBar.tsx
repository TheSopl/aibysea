'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, X, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageToggle from '@/components/LanguageToggle';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

interface TopBarProps {
  title: string;
  showBackButton?: boolean;
  backHref?: string;
}

export default function TopBar({ title, showBackButton = false, backHref }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [userInitial, setUserInitial] = useState('U');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('TopBar');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const meta = user.user_metadata || {};
        if (meta.avatar_url) setAvatarUrl(meta.avatar_url);
        if (meta.full_name) {
          setUserInitial(meta.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2));
        } else if (user.email) {
          setUserInitial(user.email[0].toUpperCase());
        }
      }
    });
  }, []);

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="sticky top-0 z-30 h-14 md:h-16 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 px-3 md:px-6 flex items-center justify-between transition-all duration-300">
      <div className={`flex items-center gap-2 ${showMobileSearch ? 'hidden' : ''}`}>
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            icon={<ArrowLeft size={20} className="text-dark dark:text-white" />}
            onClick={handleBack}
            className="lg:hidden -ms-2"
            aria-label="Go back"
          />
        )}
        <h1 className="text-lg md:text-heading-2 font-bold text-dark dark:text-white truncate">
          {title}
        </h1>
      </div>

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

      <div className="flex items-center gap-1 md:gap-4">
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          icon={showMobileSearch ? <X size={20} className="text-text-secondary dark:text-slate-400" /> : <Search size={20} className="text-text-secondary dark:text-slate-400" />}
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden"
        />

        <div className="hidden md:block">
          <LanguageToggle />
        </div>

        <Button
          variant="ghost"
          size="sm"
          iconOnly
          icon={theme === 'light' ? <Moon size={20} className="text-text-secondary dark:text-slate-400" /> : <Sun size={20} className="text-yellow-500" />}
          onClick={toggleTheme}
          title={t('toggleDarkMode')}
        />

        <Button variant="ghost" size="sm" iconOnly icon={<Bell size={20} className="text-text-secondary dark:text-slate-400" />} className="relative">
          <span className="absolute top-1 end-1 w-2 h-2 bg-red rounded-full"></span>
        </Button>

        <Link href="/profile" className="hidden md:flex items-center gap-3 p-2 hover:bg-light-bg dark:hover:bg-slate-700 rounded-lg transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-gray-200 dark:ring-slate-600 overflow-hidden"
            style={{ background: 'linear-gradient(to bottom right, #4EB6C9, #003EF3)' }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              userInitial
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
