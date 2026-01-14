'use client';

import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  // AI metrics has its own layout with Navigation component
  // Don't render Header + Sidebar for those routes
  if (pathname?.startsWith('/dashboard/ai-metrics')) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      {/* Layout stays the same in RTL - sidebar always on left (Instagram approach) */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-navy">
          {children}
        </main>
      </div>
    </div>
  )
}
