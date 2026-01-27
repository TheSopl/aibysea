'use client';

import { Link, usePathname } from '@/i18n/navigation';
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
  File
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

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname?.startsWith(item.href);
    const Icon = item.icon;
    const name = t(item.nameKey);

    return (
      <Link
        key={item.nameKey}
        href={item.href}
        className={`group flex items-center justify-center w-full h-14 rounded-xl transition-all duration-300 relative ${
          isActive
            ? 'bg-gradient-to-r from-accent to-primary text-white shadow-xl shadow-accent/30'
            : 'text-white/60 hover:bg-white/10 hover:text-white hover:shadow-lg'
        }`}
        title={name}
      >
        <Icon size={22} strokeWidth={2.5} className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`} />
      </Link>
    );
  };

  return (
    <div className="hidden lg:flex fixed start-0 top-0 h-full w-20 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] text-white z-50 flex-col shadow-2xl">
      {/* Logo */}
      <div className="flex items-center justify-center border-b border-white/10 h-20">
        <div className="relative w-16 h-16">
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
      <nav className="flex-1 p-3 space-y-2 overflow-hidden">
        {/* Top Section */}
        {navigationConfig.topSection.map(item => renderNavItem(item))}

        {/* Service Modules */}
        {navigationConfig.modules.map((module) => {
          const ModuleIcon = module.icon;
          const hasActiveItem = module.items.some(item => pathname?.startsWith(item.href));

          return (
            <div key={module.nameKey}>
              {/* Module Divider */}
              <div className="h-px bg-white/10 my-2"></div>

              {/* Module Icon (visible on hover) */}
              <div className="flex items-center justify-center h-10 group relative">
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                  hasActiveItem
                    ? `bg-gradient-to-br ${module.color} shadow-lg ${
                        module.nameKey === 'voice' ? 'shadow-service-voice-glow' :
                        module.nameKey === 'documents' ? 'shadow-service-documents-glow' :
                        'shadow-accent/30'
                      }`
                    : `text-white/40 group-hover:text-white/60 group-hover:${
                        module.nameKey === 'voice' ? 'shadow-lg shadow-service-voice-500/50' :
                        module.nameKey === 'documents' ? 'shadow-lg shadow-service-documents-500/50' :
                        ''
                      }`
                }`}>
                  <ModuleIcon size={16} strokeWidth={2.5} />
                </div>
              </div>

              {/* Module Items */}
              <div className="space-y-2">
                {module.items.map(item => renderNavItem(item))}
              </div>
            </div>
          );
        })}

        {/* Divider before bottom section */}
        {navigationConfig.bottomSection.length > 0 && <div className="h-px bg-white/10 my-2"></div>}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 space-y-2 border-t border-white/10">
        {navigationConfig.bottomSection.map(item => renderNavItem(item))}
      </div>

      {/* User Profile at Bottom */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold shadow-lg hover:shadow-accent/50 transition-all duration-300 hover:scale-105 cursor-pointer">
            R
          </div>
        </div>
      </div>
    </div>
  );
}
