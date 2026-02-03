'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Search, Bell, Moon, Sun, X, ArrowLeft, Settings, User, LogOut,
  Shield, Key, Bell as BellIcon, Users, CreditCard, BarChart3,
  FileText, Activity, BookOpen, MessageCircle, ChevronDown, Building2
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageToggle from '@/components/LanguageToggle';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/app/actions/auth';
import Button from '@/components/ui/Button';

interface TopBarProps {
  title: string;
  showBackButton?: boolean;
  backHref?: string;
}

export default function TopBar({ title, showBackButton = false, backHref }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userInitial, setUserInitial] = useState('U');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations('TopBar');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const meta = user.user_metadata || {};
        if (meta.avatar_url) setAvatarUrl(meta.avatar_url);
        if (meta.full_name) {
          setUserName(meta.full_name);
          setUserInitial(meta.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2));
        } else if (user.email) {
          setUserInitial(user.email[0].toUpperCase());
        }
        if (user.email) setUserEmail(user.email);
      }
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  const menuItemClass = "flex items-center gap-2.5 px-3 py-[7px] text-[13px] text-dark dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/70 transition-colors w-full text-start";
  const sectionLabelClass = "px-3 pt-2 pb-1 text-[10px] font-semibold text-text-secondary dark:text-slate-500 uppercase tracking-wider";

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

      <div className="flex items-center gap-1 md:gap-3">
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

        {/* Profile with enterprise dropdown */}
        <div ref={profileRef} className="relative hidden md:block">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 ps-2 pe-1.5 py-1.5 hover:bg-light-bg dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-gray-200 dark:ring-slate-600 overflow-hidden flex-shrink-0"
              style={{ background: 'linear-gradient(to bottom right, #4EB6C9, #003EF3)' }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                userInitial
              )}
            </div>
            <ChevronDown size={14} className={`text-text-secondary transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          <div
            className={`absolute end-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden transition-all duration-200 origin-top-right ${
              showProfileMenu
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
            }`}
          >
              {/* Header: User info + workspace + theme */}
              <div className="px-3 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden flex-shrink-0"
                    style={{ background: 'linear-gradient(to bottom right, #4EB6C9, #003EF3)' }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      userInitial
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark dark:text-white truncate">{userName || 'User'}</p>
                    <p className="text-xs text-text-secondary dark:text-slate-400 truncate">{userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md text-[11px] font-medium text-dark dark:text-slate-300">
                    <Building2 size={11} />
                    AI By Sea
                  </span>
                  <button
                    onClick={() => { setShowProfileMenu(false); toggleTheme(); }}
                    className="ms-auto p-1 rounded-md hover:bg-white dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600 transition-colors"
                    title={theme === 'light' ? 'Dark mode' : 'Light mode'}
                  >
                    {theme === 'light' ? <Moon size={13} className="text-text-secondary" /> : <Sun size={13} className="text-yellow-500" />}
                  </button>
                </div>
              </div>

              {/* Account section */}
              <div>
                <p className={sectionLabelClass}>Account</p>
                <Link href="/profile" onClick={() => setShowProfileMenu(false)} className={menuItemClass}>
                  <User size={15} className="text-text-secondary flex-shrink-0" />
                  Profile
                </Link>
                <Link href="/settings" onClick={() => setShowProfileMenu(false)} className={menuItemClass}>
                  <Settings size={15} className="text-text-secondary flex-shrink-0" />
                  Account Settings
                </Link>
                <Link href="/settings#notifications" onClick={() => setShowProfileMenu(false)} className={menuItemClass}>
                  <BellIcon size={15} className="text-text-secondary flex-shrink-0" />
                  Notifications
                </Link>
                <Link href="/settings#security" onClick={() => setShowProfileMenu(false)} className={menuItemClass}>
                  <Shield size={15} className="text-text-secondary flex-shrink-0" />
                  Security
                </Link>
                <Link href="/settings#api-keys" onClick={() => setShowProfileMenu(false)} className={menuItemClass}>
                  <Key size={15} className="text-text-secondary flex-shrink-0" />
                  API Keys
                </Link>
              </div>

              {/* Workspace section */}
              <div className="border-t border-gray-100 dark:border-slate-700">
                <p className={sectionLabelClass}>Workspace</p>
                <button className={menuItemClass}>
                  <Building2 size={15} className="text-text-secondary flex-shrink-0" />
                  Switch Workspace
                </button>
                <Link href="/settings#team" onClick={() => setShowProfileMenu(false)} className={menuItemClass}>
                  <Users size={15} className="text-text-secondary flex-shrink-0" />
                  Team & Roles
                </Link>
                <Link href="/settings#billing" onClick={() => setShowProfileMenu(false)} className={menuItemClass}>
                  <CreditCard size={15} className="text-text-secondary flex-shrink-0" />
                  Billing
                </Link>
                <Link href="/settings#usage" onClick={() => setShowProfileMenu(false)} className={menuItemClass}>
                  <BarChart3 size={15} className="text-text-secondary flex-shrink-0" />
                  Usage & Limits
                </Link>
                <Link href="/settings#audit" onClick={() => setShowProfileMenu(false)} className={menuItemClass}>
                  <FileText size={15} className="text-text-secondary flex-shrink-0" />
                  Audit Log
                </Link>
              </div>

              {/* Support section */}
              <div className="border-t border-gray-100 dark:border-slate-700">
                <p className={sectionLabelClass}>Support</p>
                <button className={`${menuItemClass} group`}>
                  <Activity size={15} className="text-text-secondary flex-shrink-0" />
                  System Status
                  <span className="ms-auto w-1.5 h-1.5 rounded-full bg-green-500"></span>
                </button>
                <button className={menuItemClass}>
                  <BookOpen size={15} className="text-text-secondary flex-shrink-0" />
                  Docs
                </button>
                <button className={menuItemClass}>
                  <MessageCircle size={15} className="text-text-secondary flex-shrink-0" />
                  Contact Support
                </button>
                <button className={menuItemClass}>
                  <FileText size={15} className="text-text-secondary flex-shrink-0" />
                  Changelog
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 dark:border-slate-700 p-1.5">
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex items-center gap-2.5 px-2.5 py-2 text-[13px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-start rounded-lg"
                  >
                    <LogOut size={15} />
                    Log Out
                  </button>
                </form>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
