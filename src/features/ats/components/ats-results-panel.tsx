'use client';

import React from 'react';
import { AlertTriangle, Gauge, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AtsScoreResult } from '@/types/ats';
import { AtsKeywordChips } from './ats-keyword-chips';
import { AtsScoreBreakdown } from './ats-score-breakdown';
import { AtsScoreGauge } from './ats-score-gauge';
import { AtsSectionScores } from './ats-section-scores';
import { AtsSuggestionsList } from './ats-suggestions-list';

type AtsResultsPanelProps = {
  result: AtsScoreResult | null;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
};

export function AtsResultsPanel({
  result,
  isLoading,
  error,
  onRetry,
}: AtsResultsPanelProps) {
  if (isLoading) {
    return (
      <Card className="relative overflow-hidden">
        <CardContent className="flex min-h-[280px] flex-col items-center justify-center gap-3 pt-6">
          <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
          <p className="text-sm font-medium text-gray-700">Analyzing resume…</p>
          <p className="text-xs text-gray-500">
            Scoring against the job description. This may take a moment.
          </p>
          <div className="mt-4 grid w-full gap-3 sm:grid-cols-2">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-100 bg-red-50/60">
        <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 pt-6 text-center">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <p className="font-semibold text-red-800">Couldn’t calculate ATS score</p>
          <p className="max-w-md text-sm text-red-600">{error}</p>
          {onRetry ? (
            <Button type="button" variant="outline" onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-2 pt-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <Gauge className="h-6 w-6" />
          </div>
          <p className="font-semibold text-gray-900">No analysis yet</p>
          <p className="max-w-sm text-sm text-gray-500">
            Select a resume, paste a job description, and submit to see your ATS score.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col items-center pt-6 sm:pt-8">
          <p className="mb-4 text-sm font-medium text-gray-500">Overall score</p>
          <AtsScoreGauge score={result.overallScore} />
        </CardContent>
      </Card>

      <AtsKeywordChips
        matchedKeywords={result.matchedKeywords}
        missingKeywords={result.missingKeywords}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <AtsSectionScores sectionScores={result.sectionScores} />
        <AtsScoreBreakdown result={result} />
      </div>

      <AtsSuggestionsList suggestions={result.suggestions} />
    </div>
  );
}
