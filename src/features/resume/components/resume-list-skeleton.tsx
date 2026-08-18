'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function ResumeCardSkeleton() {
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-8 w-full rounded-full" />
    </Card>
  );
}

export function ResumeListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ResumeCardSkeleton key={index} />
      ))}
    </div>
  );
}
