'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4 shadow-sm">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Something went wrong!
      </h2>
      <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <Button onClick={() => reset()} variant="default" className="gap-2">
        <RefreshCw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
