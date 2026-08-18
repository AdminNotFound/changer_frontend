import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 border border-gray-100 rounded-2xl bg-white space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
