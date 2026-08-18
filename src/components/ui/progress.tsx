import * as React from 'react';
import { cn } from '@/lib/utils/cn';

type ProgressProps = {
  value: number;
  className?: string;
};

export function Progress({ value, className }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        'h-2 w-full overflow-hidden rounded-full bg-gray-100',
        className
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-purple-600 transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
