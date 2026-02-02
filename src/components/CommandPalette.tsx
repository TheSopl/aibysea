'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LayoutDashboard, FileText, Activity, Settings, Download, Zap, BarChart3, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  shortcut?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const commands: Command[] = [
    {
      id: 'home',
      title: 'Dashboard',
      description: 'Go to home dashboard',
      icon: <LayoutDashboard size={18} />,
      action: () => {
        router.push('/dashboard');
        setOpen(false);
      },
      category: 'Navigation',
      shortcut: '⌘D'
    },
    {
      id: 'documents',
      title: 'Upload Documents',
      description: 'Go to document upload',
      icon: <FileText size={18} />,
      action: () => {
        router.push('/documents');
        setOpen(false);
      },
      category: 'Navigation',
      shortcut: '⌘U'
    },
    {
      id: 'processing',
      title: 'Processing Queue',
      description: 'View processing jobs',
      icon: <Activity size={18} />,
      action: () => {
        router.push('/processing');
        setOpen(false);
      },
      category: 'Navigation',
      shortcut: '⌘P'
    },
    {
      id: 'data',
      title: 'Extracted Data',
      description: 'View extracted data',
      icon: <BarChart3 size={18} />,
      action: () => {
        router.push('/data');
        setOpen(false);
      },
      category: 'Navigation'
    },
    {
      id: 'inbox',
      title: 'Inbox',
      description: 'Go to inbox',
      icon: <Zap size={18} />,
      action: () => {
        router.push('/inbox');
        setOpen(false);
      },
      category: 'Navigation'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Open settings',
      icon: <Settings size={18} />,
      action: () => {
        router.push('/settings');
        setOpen(false);
      },
      category: 'Navigation',
      shortcut: '⌘,'
    },
    {
      id: 'theme',
      title: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`,
      description: `Enable ${theme === 'light' ? 'dark' : 'light'} mode`,
      icon: theme === 'light' ? <Moon size={18} /> : <Sun size={18} />,
      action: () => {
        toggleTheme();
        addToast(`Switched to ${theme === 'light' ? 'dark' : 'light'} mode`, 'success');
        setOpen(false);
      },
      category: 'Settings',
      shortcut: '⌘T'
    },
    {
      id: 'export',
      title: 'Export Data',
      description: 'Export all extracted data',
      icon: <Download size={18} />,
      action: () => {
        addToast('Exporting data...', 'info');
        setOpen(false);
      },
      category: 'Actions'
    }
  ];

  const filtered = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }

      // Keyboard shortcuts
      if (!open) return;

      if (e.key === 'Escape') {
        setOpen(false);
      }

      // Navigate to specific pages with shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'd') {
          e.preventDefault();
          router.push('/dashboard');
          setOpen(false);
        } else if (e.key === 'u') {
          e.preventDefault();
          router.push('/documents');
          setOpen(false);
        } else if (e.key === 'p') {
          e.preventDefault();
          router.push('/processing');
          setOpen(false);
        } else if (e.key === 't') {
          e.preventDefault();
          toggleTheme();
          setOpen(false);
        } else if (e.key === ',') {
          e.preventDefault();
          router.push('/settings');
          setOpen(false);
        }
      }
    };

    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [open, router, toggleTheme]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Command Palette */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <Search size={24} className="text-text-secondary dark:text-slate-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search commands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-dark dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-500 outline-none text-lg font-semibold"
            />
            <span className="text-xs text-text-secondary dark:text-slate-400 px-2 py-1 bg-light-bg dark:bg-slate-700 rounded">
              ESC
            </span>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto p-4 space-y-4">
            {Object.entries(grouped).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-secondary dark:text-slate-400">No commands found</p>
              </div>
            ) : (
              Object.entries(grouped).map(([category, cmds]) => (
                <div key={category}>
                  <p className="text-xs uppercase font-bold text-text-secondary dark:text-slate-500 px-2 mb-2">
                    {category}
                  </p>
                  <div className="space-y-2">
                    {cmds.map(cmd => (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-light-bg dark:hover:bg-slate-700 transition-all duration-200 group cursor-pointer"
                      >
                        <div className="text-text-secondary dark:text-slate-400 group-hover:text-primary dark:group-hover:text-primary-400 transition-colors">
                          {cmd.icon}
                        </div>
                        <div className="flex-1 text-start">
                          <p className="text-sm font-semibold text-dark dark:text-white">{cmd.title}</p>
                          <p className="text-xs text-text-secondary dark:text-slate-400">{cmd.description}</p>
                        </div>
                        {cmd.shortcut && (
                          <span className="text-xs text-text-secondary dark:text-slate-400 px-2 py-1 bg-light-bg dark:bg-slate-700 rounded font-mono whitespace-nowrap">
                            {cmd.shortcut}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
