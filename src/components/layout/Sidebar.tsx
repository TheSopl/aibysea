'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

interface NavigationStructure {
  topSection: NavItem[];
  modules: ServiceModule[];
  bottomSection: NavItem[];
}

const navigation: NavigationStructure = {
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

export default function Sidebar() {
  const pathname = usePathname();

  // Helper to flatten all navigation items for rendering (used in Task 1 implementation)
  const getAllNavItems = (): NavItem[] => {
    return [
      ...navigation.topSection,
      ...navigation.modules.flatMap(m => m.items),
      ...navigation.bottomSection,
    ];
  };

  const allItems = getAllNavItems();

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] text-white z-50 flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="p-4 flex items-center justify-center border-b border-white/10">
        <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center shadow-lg hover:shadow-accent/50 transition-all duration-300 hover:scale-105">
          <span className="text-white font-extrabold text-lg">AI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2">
        {allItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-center w-full h-14 rounded-xl transition-all duration-300 relative ${
                isActive
                  ? 'bg-gradient-to-r from-accent to-primary text-white shadow-xl shadow-accent/30'
                  : 'text-white/60 hover:bg-white/10 hover:text-white hover:shadow-lg'
              }`}
            >
              <Icon size={22} strokeWidth={2.5} className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`} />
            </Link>
          );
        })}
      </nav>

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
