'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Inbox,
  Zap,
  Phone,
  MoreHorizontal,
} from 'lucide-react';
import BottomNavItem from './BottomNavItem';
import { useNavigationStore } from '@/stores/navigation';

const navItemsConfig = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { href: '/inbox', icon: Inbox, labelKey: 'inbox' },
  { href: '/agents', icon: Zap, labelKey: 'agents' },
  { href: '/voice-agents', icon: Phone, labelKey: 'voice' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const { openDrawer, bottomNavVisible, hideBottomNav, showBottomNav } = useNavigationStore();

  // Keyboard detection using visualViewport API
  useEffect(() => {
    const handleViewportResize = () => {
      if (!window.visualViewport) return;

      // When keyboard opens, visualViewport.height becomes smaller than window.innerHeight
      // Using 0.8 threshold to account for keyboards which typically take 40%+ of screen
      const isKeyboardVisible = window.visualViewport.height < window.innerHeight * 0.8;

      if (isKeyboardVisible) {
        hideBottomNav();
      } else {
        showBottomNav();
      }
    };

    // Listen for viewport resize events (keyboard show/hide)
    window.visualViewport?.addEventListener('resize', handleViewportResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
    };
  }, [hideBottomNav, showBottomNav]);

  // Hide bottom nav when visibility is false
  if (!bottomNavVisible) {
    return null;
  }

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-slate-900 border-t border-border"
      style={{
        height: 'calc(56px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex h-[56px]">
        {navItemsConfig.map((item) => (
          <BottomNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={t(item.labelKey)}
            isActive={pathname?.startsWith(item.href) || false}
          />
        ))}
        <BottomNavItem
          icon={MoreHorizontal}
          label={t('more')}
          isActive={false}
          onClick={openDrawer}
        />
      </div>
    </nav>
  );
}
