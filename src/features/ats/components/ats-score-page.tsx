'use client';

import React, { useState } from 'react';
import { handleApiError } from '@/lib/api/error';
import type { AtsScoreInput, AtsScoreResult } from '@/types/ats';
import { useScoreAtsMutation } from '../hooks/use-score-ats-mutation';
import { AtsHistoryList } from './ats-history-list';
import { AtsResultsPanel } from './ats-results-panel';
import { AtsScoreForm } from './ats-score-form';

export function AtsScorePage() {
  const mutation = useScoreAtsMutation();
  const [lastInput, setLastInput] = useState<AtsScoreInput | null>(null);
  const [result, setResult] = useState<AtsScoreResult | null>(null);

  const handleAnalyze = (input: AtsScoreInput) => {
    setLastInput(input);
    mutation.mutate(input, {
      onSuccess: (data) => setResult(data),
    });
  };

  const handleRetry = () => {
    if (!lastInput) return;
    mutation.mutate(lastInput, {
      onSuccess: (data) => setResult(data),
    });
  };

  const error = mutation.isError ? handleApiError(mutation.error).message : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">ATS Score</h2>
        <p className="mt-1 text-sm text-gray-500">
          See how a resume matches a job description. Scores come from the backend — nothing is
          calculated in the browser.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_1fr]">
        <div className="space-y-6">
          <AtsScoreForm onSubmit={handleAnalyze} isSubmitting={mutation.isPending} />
          <AtsHistoryList />
        </div>
        <AtsResultsPanel
          result={result}
          isLoading={mutation.isPending}
          error={error}
          onRetry={lastInput ? handleRetry : undefined}
        />
      </div>
    </div>
  );
}
