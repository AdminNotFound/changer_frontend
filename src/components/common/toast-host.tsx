'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';

export function ToastHost() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-sm transition-all duration-300 ${
            t.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : t.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-900'
                : t.type === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-purple-50 border-purple-200 text-purple-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {t.type === 'success' && (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            )}
            {t.type === 'error' && (
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
            )}
            {t.type === 'info' && (
              <Info className="h-5 w-5 text-purple-600 shrink-0" />
            )}
            {t.type === 'warning' && (
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            )}
            <span className="font-medium">{t.message}</span>
          </div>
          <button
            type="button"
            onClick={() => removeToast(t.id)}
            className="p-1 hover:opacity-70 rounded-md"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
