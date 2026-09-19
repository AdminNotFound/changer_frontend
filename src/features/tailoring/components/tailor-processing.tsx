'use client';

import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TailorProcessing() {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="flex min-h-[280px] flex-col items-center justify-center gap-3 pt-6">
        <div className="relative">
          <Sparkles className="absolute -right-1 -top-1 h-4 w-4 animate-pulse text-purple-400" />
          <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        </div>
        <p className="text-sm font-medium text-gray-700">Tailoring resume…</p>
        <p className="max-w-sm text-center text-xs text-gray-500">
          The AI is rewriting your draft for this job. This can take a little while.
        </p>
        <div className="mt-4 grid w-full gap-3 sm:grid-cols-2">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}
