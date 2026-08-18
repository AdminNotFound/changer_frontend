'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

type FieldRowProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
};

export function FieldRow({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: FieldRowProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="text-xs font-semibold text-gray-700">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}
