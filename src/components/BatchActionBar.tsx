'use client';

import { Trash2, Download, Play, X } from 'lucide-react';

interface BatchActionBarProps {
  count: number;
  onDelete?: () => void;
  onDownload?: () => void;
  onProcess?: () => void;
  onClear?: () => void;
}

export function BatchActionBar({
  count,
  onDelete,
  onDownload,
  onProcess,
  onClear,
}: BatchActionBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 flex items-center gap-4 z-40 animate-slide-in border-2 border-primary-500 dark:border-primary-600">
      {/* Count Info */}
      <div className="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
        <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
          {count} selected
        </p>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-gray-200 dark:bg-slate-700" />

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {onDownload && (
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 hover:bg-light-bg dark:hover:bg-slate-700 rounded-lg transition-all duration-300 font-semibold text-sm"
          >
            <Download size={18} />
            Download
          </button>
        )}

        {onProcess && (
          <button
            onClick={onProcess}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-sm"
          >
            <Play size={18} />
            Process
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-all duration-300 font-semibold text-sm"
          >
            <Trash2 size={18} />
            Delete
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-gray-200 dark:bg-slate-700" />

      {/* Close Button */}
      <button
        onClick={onClear}
        className="p-2 hover:bg-light-bg dark:hover:bg-slate-700 rounded-lg transition-all duration-300 text-text-secondary dark:text-slate-400"
      >
        <X size={20} />
      </button>
    </div>
  );
}
