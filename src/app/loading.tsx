import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
      <p className="text-sm font-medium text-gray-500 animate-pulse">
        Loading AI Job Maker...
      </p>
    </div>
  );
}
