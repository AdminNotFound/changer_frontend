'use client';

import React from 'react';
import { AlertTriangle, Clock, Gauge, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { handleApiError } from '@/lib/api/error';
import { AtsScoreGauge } from '@/features/ats/components/ats-score-gauge';
import { useAtsHistory } from '@/features/ats/hooks/use-ats-history';
import { getScoreStroke } from '@/features/ats/utils/score-color';
import { formatVersionDate } from '@/features/resume/utils/version-format';

const ATS_HISTORY_QUERY = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt' as const,
  sortOrder: 'desc' as const,
};

function ChartEmpty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-10 text-center">
      <Clock className="mb-2 h-6 w-6 text-gray-400" />
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
}

type DashboardChartsProps = {
  averageAtsScore: number | null;
};

export function DashboardCharts({ averageAtsScore }: DashboardChartsProps) {
  const { data, isLoading, isError, error, refetch } = useAtsHistory(ATS_HISTORY_QUERY);

  const scores = [...(data?.atsScores ?? [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="h-4 w-4 text-purple-600" />
            Average ATS score
          </CardTitle>
        </CardHeader>
        <CardContent>
          {averageAtsScore == null ? (
            <ChartEmpty
              title="No ATS scores yet"
              description="Run an analysis to see your average score here."
            />
          ) : (
            <AtsScoreGauge score={averageAtsScore} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent ATS scores</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-44 items-end gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-full min-h-12 flex-1 rounded-t-lg" />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
              <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-red-500" />
              <p className="text-sm font-medium text-red-700">
                {handleApiError(error).message || 'Failed to load ATS scores.'}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => void refetch()}
              >
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : scores.length === 0 ? (
            <ChartEmpty
              title="No recent analyses"
              description="Scores you run against a saved resume will appear as a trend here."
            />
          ) : (
            <div className="flex h-44 items-end gap-1.5 sm:gap-2">
              {scores.map((item) => (
                <div
                  key={item.id}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"
                  title={`${item.resumeTitle} · ${item.overallScore} · ${formatVersionDate(item.createdAt)}`}
                >
                  <span className="text-[10px] font-semibold tabular-nums text-gray-600 sm:text-xs">
                    {item.overallScore}
                  </span>
                  <div
                    className="w-full min-h-1 rounded-t-md"
                    style={{
                      height: `${Math.max(item.overallScore, 2)}%`,
                      backgroundColor: getScoreStroke(item.overallScore),
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
