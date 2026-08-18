'use client';

import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ImportJobStatus } from '@/types/resume-import';

type ImportParsingStepProps = {
  fileName: string;
  status: ImportJobStatus | null;
  error: string | null;
  onRetry: () => void;
};

function statusLabel(status: ImportJobStatus | null): string {
  switch (status) {
    case 'queued':
      return 'Queued for parsing';
    case 'waiting':
      return 'Waiting to start';
    case 'active':
      return 'Parsing resume';
    case 'delayed':
      return 'Delayed';
    case 'failed':
      return 'Parsing failed';
    default:
      return 'Starting…';
  }
}

export function ImportParsingStep({
  fileName,
  status,
  error,
  onRetry,
}: ImportParsingStepProps) {
  const isFailed = status === 'failed' || Boolean(error);

  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          {isFailed ? 'Parsing failed' : 'Parsing your resume'}
        </h2>
        <p className="text-sm text-gray-500 mt-1 truncate">{fileName}</p>
      </div>

      {isFailed ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle className="h-7 w-7" />
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error || 'We could not extract text from this file. Try a different PDF or DOCX.'}
          </div>
          <Button type="button" variant="default" onClick={onRetry}>
            Try another file
          </Button>
        </div>
      ) : (
        <div className="space-y-4 py-8">
          <Loader2 className="h-10 w-10 animate-spin text-purple-600 mx-auto" />
          <Badge variant="secondary">{statusLabel(status)}</Badge>
          <p className="text-sm text-gray-500">
            Extracting personal info, experience, skills, and more…
          </p>
        </div>
      )}
    </div>
  );
}
