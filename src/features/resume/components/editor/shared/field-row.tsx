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
  const generatedId = React.useId();
  const childId = React.isValidElement(children)
    ? (children.props as { id?: string }).id
    : undefined;
  const controlId = childId ?? htmlFor ?? generatedId;
  const errorId = `${controlId}-error`;
  const hintId = `${controlId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  const control = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        id: controlId,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })
    : children;

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={controlId} className="text-xs font-semibold text-gray-700">
        {label}
      </label>
      {control}
      {error ? (
        <p id={errorId} className="text-xs text-red-600 font-medium" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-gray-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
