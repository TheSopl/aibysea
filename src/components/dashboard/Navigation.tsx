'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  href: string;
}

export default function Navigation() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/dashboard/ai-metrics' },
    { id: 'contacts', icon: '👥', label: 'Contacts', href: '/dashboard' },
    { id: 'chats', icon: '💬', label: 'Chats', href: '/dashboard' },
    { id: 'settings', icon: '⚙️', label: 'Settings', href: '/dashboard' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed left-0 top-0 h-full bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-accent-surface transition-all duration-300 z-40"
      style={{
        width: isExpanded ? '280px' : '80px',
        boxShadow: '4px 0 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo area */}
        <div className="h-16 flex items-center justify-center border-b border-light-border dark:border-accent-surface">
          <div className="w-10 h-10 bg-gradient-to-br from-teal to-purple rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-6">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 px-6 py-4 mb-2 transition-all duration-200 relative group ${
                    isActive
                      ? 'bg-teal/20 text-teal border-r-2 border-teal'
                      : 'text-light-text-secondary dark:text-text-secondary hover:text-teal hover:bg-light-surface-alt dark:hover:bg-accent-surface'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <motion.span
                    className="text-sm font-medium whitespace-nowrap"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{
                      opacity: isExpanded ? 1 : 0,
                      width: isExpanded ? 'auto' : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>

                  {/* Active indicator glow */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        boxShadow: 'inset 0 0 24px rgba(0, 217, 255, 0.2)',
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Logout button */}
        <div className="border-t border-accent-surface p-4">
          <button className="flex items-center gap-4 px-6 py-4 w-full text-text-secondary hover:text-red hover:bg-accent-surface transition-all duration-200 rounded-lg">
            <span className="text-2xl">↪️</span>
            <motion.span
              className="text-sm font-medium whitespace-nowrap"
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: isExpanded ? 1 : 0,
                width: isExpanded ? 'auto' : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              Logout
            </motion.span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
