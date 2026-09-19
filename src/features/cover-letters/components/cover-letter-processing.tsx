'use client';

import React from 'react';
import { Loader2, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type CoverLetterProcessingProps = {
  mode?: 'generate' | 'regenerate';
};

export function CoverLetterProcessing({ mode = 'generate' }: CoverLetterProcessingProps) {
  const isRegenerate = mode === 'regenerate';

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="flex min-h-[280px] flex-col items-center justify-center gap-3 pt-6">
        <div className="relative">
          <Mail className="absolute -right-1 -top-1 h-4 w-4 animate-pulse text-purple-400" />
          <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        </div>
        <p className="text-sm font-medium text-gray-700">
          {isRegenerate ? 'Regenerating cover letter…' : 'Generating cover letter…'}
        </p>
        <p className="max-w-sm text-center text-xs text-gray-500">
          The backend writes the letter from your resume and the job description. This can take a
          little while.
        </p>
        <Skeleton className="mt-4 h-48 w-full rounded-xl" />
      </CardContent>
    </Card>
  );
}
