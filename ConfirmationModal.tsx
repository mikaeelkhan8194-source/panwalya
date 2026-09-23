import React from 'react';
import { AlertCircle, CheckCircle, Shield, X, RefreshCw } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  impactDetails?: { label: string; value: string }[];
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  impactDetails = [],
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        role="dialog" 
        aria-modal="true"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden p-6"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isDestructive ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'}`}>
              {isDestructive ? <AlertCircle className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 leading-tight">
              {title}
            </h3>
          </div>
          <button 
            onClick={onCancel}
            disabled={isLoading}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
          {description}
        </p>

        {impactDetails.length > 0 && (
          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 mb-5 border border-stone-100 dark:border-stone-800 space-y-2 text-xs">
            {impactDetails.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-stone-600 dark:text-stone-300">
                <span className="text-stone-500 dark:text-stone-400">{item.label}</span>
                <span className="font-medium text-stone-800 dark:text-stone-200 text-right truncate max-w-[200px]">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 text-sm font-semibold rounded-xl text-white shadow-sm flex items-center gap-2 cursor-pointer transition ${
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800' 
                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
            } disabled:opacity-50`}
          >
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
