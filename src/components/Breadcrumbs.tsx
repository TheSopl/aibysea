'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();

  // Map paths to breadcrumb labels
  const pathMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'inbox': 'Inbox',
    'documents': 'Documents',
    'processing': 'Processing Queue',
    'data': 'Extracted Data',
    'voice-agents': 'Voice Agents',
    'call-logs': 'Call Logs',
    'phone-numbers': 'Phone Numbers',
    'voice-settings': 'Voice Settings',
    'templates': 'Templates',
    'settings': 'Settings',
    'agents': 'Agents',
    'contacts': 'Contacts',
    'workflows': 'Workflows',
  };

  const segments = pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on login page
  if (segments.includes('login')) {
    return null;
  }

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

    return { href, label, segment };
  });

  return (
    <div className="flex items-center gap-2 px-6 py-3 text-sm font-semibold">
      <Link href="/dashboard" className="flex items-center gap-2 text-text-secondary hover:text-primary dark:hover:text-blue-400 transition-colors">
        <Home size={18} />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.segment} className="flex items-center gap-2">
          <ChevronRight size={18} className="text-text-secondary dark:text-slate-500" />
          {index === breadcrumbs.length - 1 ? (
            <span className="text-dark dark:text-white">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-text-secondary hover:text-primary dark:hover:text-blue-400 transition-colors">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
