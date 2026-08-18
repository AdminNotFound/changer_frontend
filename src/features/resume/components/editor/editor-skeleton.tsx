'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function EditorSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="hidden lg:block h-[600px] w-full rounded-xl" />
      </div>
    </div>
  );
}
