'use client';

import { useEffect } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  X,
  Users,
  Zap,
  FileText,
  Settings,
  Phone,
  Menu,
  Database,
} from 'lucide-react';
import Image from 'next/image';
import { useNavigationStore } from '@/stores/navigation';

interface NavItem {
  nameKey: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

interface NavSection {
  nameKey: string;
  items: NavItem[];
}

// Secondary navigation - items NOT in bottom nav
const drawerNavigationConfig: { sections: NavSection[]; bottom: NavItem[] } = {
  sections: [
    {
      nameKey: 'conversational',
      items: [{ nameKey: 'contacts', href: '/contacts', icon: Users }],
    },
    {
      nameKey: 'voice',
      items: [
        { nameKey: 'callLogs', href: '/call-logs', icon: FileText },
        { nameKey: 'phoneNumbers', href: '/phone-numbers', icon: Phone },
      ],
    },
    {
      nameKey: 'documents',
      items: [
        { nameKey: 'upload', href: '/upload', icon: FileText },
        { nameKey: 'templates', href: '/templates', icon: FileText },
        { nameKey: 'processing', href: '/processing', icon: Zap },
        { nameKey: 'data', href: '/data', icon: Database },
      ],
    },
  ],
  bottom: [{ nameKey: 'settings', href: '/settings', icon: Settings }],
};

export default function MobileNav() {
  const { isDrawerOpen, openDrawer, closeDrawer } = useNavigationStore();
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  // Close drawer when route changes
  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  // Handle swipe-to-close gesture
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Close if dragged more than 100px to the left or with significant velocity
    if (info.offset.x < -100 || info.velocity.x < -500) {
      closeDrawer();
    }
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname?.startsWith(item.href);
    const Icon = item.icon;
    const name = t(item.nameKey);

    return (
      <Link
        key={item.nameKey}
        href={item.href}
        onClick={closeDrawer}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 min-h-[44px] ${
          isActive
            ? 'bg-gradient-to-r from-accent to-primary text-white shadow-lg'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Icon size={20} strokeWidth={2} />
        <span className="font-medium">{name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] z-50 flex items-center justify-between px-4 shadow-lg">
        {/* Menu Button */}
        <button
          onClick={openDrawer}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <div className="relative w-10 h-10">
          <Image
            src="/images/ChatGPT Image Jan 16, 2026, 11_30_10 PM.png"
            alt="AI BY SEA"
            fill
            className="object-contain"
          />
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-sm">
          R
        </div>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={closeDrawer}
          />
        )}
      </AnimatePresence>

      {/* Drawer with swipe-to-close */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{
              type: 'tween',
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1],
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.2, right: 0 }}
            onDragEnd={handleDragEnd}
            className="lg:hidden fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-white font-bold text-lg">{t('more')}</span>
              <button
                onClick={closeDrawer}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation - Flat grouped list with section headers */}
            <nav className="flex-1 p-4 overflow-y-auto">
              {drawerNavigationConfig.sections.map((section, sectionIndex) => (
                <div key={section.nameKey} className={sectionIndex > 0 ? 'mt-4' : ''}>
                  {/* Section Header */}
                  <div className="px-4 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                    {t(section.nameKey)}
                  </div>
                  {/* Section Items */}
                  <div className="space-y-1">
                    {section.items.map((item) => renderNavItem(item))}
                  </div>
                </div>
              ))}

              {/* Bottom Section (Settings) */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-1">
                {drawerNavigationConfig.bottom.map((item) => renderNavItem(item))}
              </div>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">User</p>
                  <p className="text-white/50 text-xs truncate">user@example.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
