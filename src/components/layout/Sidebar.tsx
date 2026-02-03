'use client';

import { Link, usePathname } from '@/lib/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Inbox,
  Users,
  Zap,
  FileText,
  Settings,
  MessageCircle,
  Phone,
  File,
  Workflow
} from 'lucide-react';

interface NavItem {
  nameKey: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

interface ServiceModule {
  nameKey: string;
  color: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  items: NavItem[];
}

interface NavigationStructure {
  topSection: NavItem[];
  modules: ServiceModule[];
  bottomSection: NavItem[];
}

const navigationConfig: NavigationStructure = {
  topSection: [
    { nameKey: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  ],
  modules: [
    {
      nameKey: 'conversational',
      color: 'from-accent to-primary',
      icon: MessageCircle,
      items: [
        { nameKey: 'inbox', href: '/inbox', icon: Inbox },
        { nameKey: 'agents', href: '/agents', icon: Zap },
        { nameKey: 'contacts', href: '/contacts', icon: Users },
        { nameKey: 'workflows', href: '/workflows', icon: Workflow },
      ],
    },
    {
      nameKey: 'voice',
      color: 'from-teal-400 to-teal-600',
      icon: Phone,
      items: [
        { nameKey: 'voiceAgents', href: '/voice-agents', icon: Zap },
        { nameKey: 'callLogs', href: '/call-logs', icon: FileText },
        { nameKey: 'phoneNumbers', href: '/phone-numbers', icon: Users },
      ],
    },
    {
      nameKey: 'documents',
      color: 'from-orange-400 to-orange-600',
      icon: File,
      items: [
        { nameKey: 'upload', href: '/documents', icon: FileText },
        { nameKey: 'processing', href: '/processing', icon: Zap },
        { nameKey: 'data', href: '/data', icon: Users },
      ],
    },
  ],
  bottomSection: [
    { nameKey: 'settings', href: '/settings', icon: Settings },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  const renderNavItem = (item: NavItem, moduleColor?: string) => {
    const isActive = pathname?.startsWith(item.href);
    const Icon = item.icon;
    const name = t(item.nameKey);

    return (
      <Link
        key={item.nameKey}
        href={item.href}
        className={`group relative flex items-center justify-center w-full h-11 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-white/15 text-white'
            : 'text-white/50 hover:bg-white/8 hover:text-white/80'
        }`}
        title={name}
      >
        {/* Active indicator bar */}
        {isActive && (
          <div className={`absolute start-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-e-full bg-gradient-to-b ${moduleColor || 'from-accent to-primary'}`} />
        )}
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-200 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} />
      </Link>
    );
  };

  return (
    <div className="hidden lg:flex fixed start-0 top-0 h-full w-[72px] bg-gradient-to-b from-[#0f1629] via-[#131b35] to-[#0d1220] text-white z-50 flex-col shadow-2xl border-e border-white/5">
      {/* Logo */}
      <div className="flex items-center justify-center h-[80px] border-b border-white/8">
        <div className="relative w-[52px] h-[52px]">
          <Image
            src="/images/ChatGPT Image Jan 16, 2026, 11_30_10 PM.png"
            alt="AI BY SEA"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden scrollbar-none">
        {/* Top Section */}
        {navigationConfig.topSection.map(item => renderNavItem(item))}

        {/* Service Modules */}
        {navigationConfig.modules.map((module) => {
          const ModuleIcon = module.icon;
          const hasActiveItem = module.items.some(item => pathname?.startsWith(item.href));

          return (
            <div key={module.nameKey} className="pt-2 mt-2 first:pt-0 first:mt-0">
              {/* Module Divider with Icon */}
              <div className="flex items-center justify-center mb-1.5">
                <div className="h-px bg-white/8 flex-1" />
                <div className={`mx-1.5 flex items-center justify-center w-6 h-6 rounded-md transition-all duration-200 ${
                  hasActiveItem
                    ? `bg-gradient-to-br ${module.color} shadow-sm`
                    : 'text-white/25'
                }`}>
                  <ModuleIcon size={12} strokeWidth={2.5} />
                </div>
                <div className="h-px bg-white/8 flex-1" />
              </div>

              {/* Module Items */}
              <div className="space-y-0.5">
                {module.items.map(item => renderNavItem(item, module.color))}
              </div>
            </div>
          );
        })}

        {/* Settings - right after nav items */}
        <div className="pt-2 mt-2">
          <div className="flex items-center justify-center mb-1.5">
            <div className="h-px bg-white/8 flex-1" />
          </div>
          <div className="space-y-0.5">
            {navigationConfig.bottomSection.map(item => renderNavItem(item))}
          </div>
        </div>
      </nav>

    </div>
  );
}
