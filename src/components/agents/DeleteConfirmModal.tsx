'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  agentName: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  agentName,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red/10 rounded-xl flex items-center justify-center">
              <AlertTriangle size={20} className="text-red" />
            </div>
            <h2 className="text-xl font-extrabold text-dark dark:text-white">
              Delete Agent
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-text-secondary dark:text-slate-300">
            Are you sure you want to delete{' '}
            <span className="font-bold text-dark dark:text-white">{agentName}</span>?
          </p>
          <p className="mt-2 text-sm text-red/80">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 bg-light-bg dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-dark dark:text-white rounded-xl font-bold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-red hover:bg-red/90 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Agent'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
