'use client';

import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-light-bg dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main Content - adjusted for mobile header and desktop sidebar */}
      <div className="pt-16 lg:pt-0 lg:ml-20 h-screen flex flex-col overflow-hidden">
        <Breadcrumbs />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
