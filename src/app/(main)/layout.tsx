'use client';

import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-light-bg dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      <Sidebar />
      <div className="ml-20 h-screen flex flex-col overflow-hidden">
        <Breadcrumbs />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
