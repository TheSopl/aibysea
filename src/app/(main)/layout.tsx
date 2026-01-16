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
    <div className="min-h-screen bg-light-bg dark:bg-slate-900 scroll-smooth transition-colors duration-300">
      <Sidebar />
      <div className="ml-20 min-h-screen flex flex-col scroll-smooth">
        <Breadcrumbs />
        <div className="flex-1 scroll-smooth">{children}</div>
      </div>
    </div>
  );
}
