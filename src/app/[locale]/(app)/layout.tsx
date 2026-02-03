'use client';

import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import BottomNav from '@/components/layout/BottomNav';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import PageTransition from '@/components/ui/PageTransition';
import ChatWidget from '@/components/chat/ChatWidget';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-light-bg dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navigation (Drawer) */}
      <MobileNav />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Main Content - adjusted for mobile header/footer and desktop sidebar */}
      <div className="pt-16 pb-[calc(56px+env(safe-area-inset-bottom,0px))] lg:pt-0 lg:pb-0 lg:ms-[72px] h-screen flex flex-col overflow-hidden">
        <div className="hidden lg:block">
          <Breadcrumbs />
        </div>
        <div className="flex-1 overflow-auto">
          <PageTransition>{children}</PageTransition>
        </div>
      </div>

      {/* Floating AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}
