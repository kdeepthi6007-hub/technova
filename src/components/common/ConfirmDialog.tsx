// Confirmation Dialog Modal with Accessible Focus & Distinct Danger Actions

import React from 'react';
import { AlertTriangle, AlertCircle, Trash2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
      />
      
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${
            isDestructive ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {isDestructive ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-md transition-colors ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-farm-700 hover:bg-farm-800'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
