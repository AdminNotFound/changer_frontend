'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type QueryErrorRetryProps = {
  message: string;
  onRetry: () => void;
};

export function QueryErrorRetry({ message, onRetry }: QueryErrorRetryProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-red-600" role="alert">
        {message}
      </p>
      <Button type="button" variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
        Retry
      </Button>
    </div>
  );
}
