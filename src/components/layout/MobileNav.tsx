'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  Inbox,
  Users,
  Zap,
  FileText,
  Settings,
  MessageCircle,
  Phone,
  File,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

interface ServiceModule {
  name: string;
  color: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  items: NavItem[];
}

const navigation = {
  topSection: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ],
  modules: [
    {
      name: 'Conversational',
      color: 'from-accent to-primary',
      icon: MessageCircle,
      items: [
        { name: 'Inbox', href: '/inbox', icon: Inbox },
        { name: 'AI Agents', href: '/agents', icon: Zap },
        { name: 'Contacts', href: '/contacts', icon: Users },
      ],
    },
    {
      name: 'Voice',
      color: 'from-teal-400 to-teal-600',
      icon: Phone,
      items: [
        { name: 'Voice Agents', href: '/voice-agents', icon: Zap },
        { name: 'Call Logs', href: '/call-logs', icon: FileText },
        { name: 'Phone Numbers', href: '/phone-numbers', icon: Users },
      ],
    },
    {
      name: 'Documents',
      color: 'from-orange-400 to-orange-600',
      icon: File,
      items: [
        { name: 'Upload', href: '/documents', icon: FileText },
        { name: 'Processing', href: '/processing', icon: Zap },
        { name: 'Data', href: '/data', icon: Users },
      ],
    },
  ],
  bottomSection: [
    { name: 'Settings', href: '/settings', icon: Settings },
  ],
};

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>(['Conversational']);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleModule = (moduleName: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleName)
        ? prev.filter(m => m !== moduleName)
        : [...prev, moduleName]
    );
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname?.startsWith(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r from-accent to-primary text-white shadow-lg'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Icon size={20} strokeWidth={2} />
        <span className="font-medium">{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] z-50 flex items-center justify-between px-4 shadow-lg">
        {/* Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
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
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] z-50 transform transition-transform duration-300 ease-out shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/images/ChatGPT Image Jan 16, 2026, 11_30_10 PM.png"
                alt="AI BY SEA"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-white font-bold text-lg">AI BY SEA</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          {/* Top Section */}
          <div className="space-y-1 mb-4">
            {navigation.topSection.map(item => renderNavItem(item))}
          </div>

          {/* Service Modules */}
          {navigation.modules.map((module) => {
            const ModuleIcon = module.icon;
            const isExpanded = expandedModules.includes(module.name);
            const hasActiveItem = module.items.some(item => pathname?.startsWith(item.href));

            return (
              <div key={module.name} className="mb-2">
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    hasActiveItem
                      ? `bg-gradient-to-r ${module.color} text-white shadow-lg`
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ModuleIcon size={20} strokeWidth={2} />
                    <span className="font-semibold">{module.name}</span>
                  </div>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {/* Module Items */}
                {isExpanded && (
                  <div className="mt-1 ml-4 space-y-1 border-l-2 border-white/10 pl-4">
                    {module.items.map(item => renderNavItem(item))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Section */}
          <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
            {navigation.bottomSection.map(item => renderNavItem(item))}
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
      </div>
    </>
  );
}
