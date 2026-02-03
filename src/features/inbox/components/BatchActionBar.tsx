'use client';

import { Trash2, Download, Play, X } from 'lucide-react';
import Button from '@/components/ui/Button';

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
          <Button variant="ghost" size="sm" icon={<Download size={18} />} onClick={onDownload}>
            Download
          </Button>
        )}

        {onProcess && (
          <Button variant="primary" size="sm" icon={<Play size={18} />} onClick={onProcess}>
            Process
          </Button>
        )}

        {onDelete && (
          <Button variant="danger" size="sm" icon={<Trash2 size={18} />} onClick={onDelete} className="bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">
            Delete
          </Button>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-gray-200 dark:bg-slate-700" />

      {/* Close Button */}
      <Button variant="ghost" size="sm" iconOnly icon={<X size={20} />} onClick={onClear} className="text-text-secondary dark:text-slate-400" />
    </div>
  );
}
