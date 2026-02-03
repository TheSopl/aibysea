'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from '@/components/ui/Button';

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
            <h2 className="text-heading-3 font-extrabold text-dark dark:text-white">
              Delete Agent
            </h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            iconOnly
            icon={<X size={20} />}
            aria-label="Close"
          />
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
          <Button
            type="button"
            onClick={onClose}
            disabled={loading}
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            loading={loading}
            variant="danger"
            size="lg"
            className="flex-1"
          >
            Delete Agent
          </Button>
        </div>
      </div>
    </div>
  );
}
