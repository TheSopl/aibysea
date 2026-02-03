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
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { id: 'chats', icon: '💬', label: 'Chats', href: '/conversations' },
    { id: 'settings', icon: '⚙️', label: 'Settings', href: '/conversations' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed left-0 top-0 h-full bg-white border-e border-gray-200 transition-all duration-500 z-50 shadow-sm"
      style={{
        width: isExpanded ? '280px' : '80px',
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo area */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-design flex items-center justify-center shadow-md">
            <span className="text-white font-extrabold">AI</span>
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
                  className={`flex items-center gap-4 px-6 py-4 mb-2 transition-all duration-300 relative group rounded-design mx-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    isActive
                      ? 'bg-accent/20 text-primary shadow-sm'
                      : 'text-text-secondary hover:text-primary hover:bg-light-bg'
                  }`}
                >
                  <span className="text-heading-2">{item.icon}</span>
                  <motion.span
                    className="text-sm font-semibold whitespace-nowrap"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{
                      opacity: isExpanded ? 1 : 0,
                      width: isExpanded ? 'auto' : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute start-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-e"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Logout button */}
        <div className="border-t border-gray-200 p-4">
          <button className="flex items-center gap-4 px-6 py-4 w-full text-text-secondary hover:text-red hover:bg-red/10 transition-all duration-200 rounded-design focus:outline-none focus:ring-2 focus:ring-red focus:ring-offset-2">
            <span className="text-heading-2">↪️</span>
            <motion.span
              className="text-sm font-semibold whitespace-nowrap"
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
