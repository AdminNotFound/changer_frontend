'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { handleApiError } from '@/lib/api/error';
import { formatVersionDate } from '@/features/resume/utils/version-format';
import { useRecentTailored } from '../hooks/use-recent-tailored';

export function TailorRecentList() {
  const { data, isLoading, isError, error, refetch } = useRecentTailored({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const items = data?.tailored ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent tailored versions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
            <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-red-500" />
            <p className="text-sm font-medium text-red-700">
              {handleApiError(error).message || 'Failed to load tailored versions.'}
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
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-8 text-center">
            <Clock className="mb-2 h-6 w-6 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">No tailored versions yet</p>
            <p className="mt-1 text-xs text-gray-500">
              Finished tailoring jobs will appear here as saved versions.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li
                key={item.versionId}
                className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {item.resumeTitle}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.changeSummary || 'AI tailored resume'}
                    {' · '}
                    {formatVersionDate(item.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">v{item.versionNumber}</Badge>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/edit/${item.resumeId}`}>
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Open
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
