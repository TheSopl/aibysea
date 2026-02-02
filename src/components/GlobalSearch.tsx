'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, Clock, CheckCircle, X } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'job' | 'data';
  href: string;
  icon: React.ReactNode;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  // Mock search data
  const allItems: SearchResult[] = [
    { id: '1', title: 'Invoice_Jan_2024.pdf', description: 'Invoice Template', type: 'document', href: '#', icon: <FileText size={18} /> },
    { id: '2', title: 'Receipt_Store_ABC.pdf', description: 'Receipt Template', type: 'document', href: '#', icon: <FileText size={18} /> },
    { id: '3', title: 'Processing Job #001', description: 'Invoice extraction in progress', type: 'job', href: '/processing', icon: <Clock size={18} /> },
    { id: '4', title: 'Completed Job #002', description: 'Receipt extraction completed', type: 'job', href: '/processing', icon: <CheckCircle size={18} /> },
  ];

  useEffect(() => {
    if (search.trim()) {
      const filtered = allItems.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [search]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
        <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <Search size={24} className="text-text-secondary dark:text-slate-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search documents, jobs, and data..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-dark dark:text-white placeholder:text-text-secondary dark:placeholder:text-slate-500 outline-none text-lg font-semibold"
            />
            <button
              onClick={() => setOpen(false)}
              className="text-text-secondary dark:text-slate-400 hover:text-dark dark:hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-4">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-secondary dark:text-slate-400">
                  {search.trim() ? 'No results found' : 'Start typing to search'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map(result => (
                  <button
                    key={result.id}
                    onClick={() => setOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-light-bg dark:hover:bg-slate-700 transition-all duration-200 group cursor-pointer text-start"
                  >
                    <div className="text-text-secondary dark:text-slate-400 group-hover:text-primary dark:group-hover:text-primary-400 transition-colors">
                      {result.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-dark dark:text-white truncate">{result.title}</p>
                      <p className="text-xs text-text-secondary dark:text-slate-400">{result.description}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-light-bg dark:bg-slate-700 rounded text-text-secondary dark:text-slate-400 font-mono whitespace-nowrap">
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
