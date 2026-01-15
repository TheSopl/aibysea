'use client';

import { Search, Bell, User } from 'lucide-react';

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-dark">{title}</h1>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
          <input
            type="text"
            placeholder="Search conversations, contacts..."
            className="w-full pl-12 pr-4 py-2.5 bg-light-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-light-bg rounded-lg transition-colors">
          <Bell size={20} className="text-text-secondary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red rounded-full"></span>
        </button>

        {/* User Menu */}
        <button className="flex items-center gap-3 p-2 hover:bg-light-bg rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-sm">
            R
          </div>
        </button>
      </div>
    </div>
  );
}
