'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  FileText,
  Gauge,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { handleApiError } from '@/lib/api/error';
import { useDashboardStatistics } from '../hooks/use-dashboard-statistics';
import { CreateResumeDialog } from '@/features/resume/components/create-resume-dialog';

function formatActivityType(type: string): string {
  switch (type) {
    case 'resume_updated':
      return 'Resume updated';
    case 'version_created':
      return 'Version created';
    case 'ats_scored':
      return 'ATS scored';
    case 'tailored':
      return 'Tailored';
    case 'cover_letter':
      return 'Cover letter';
    default:
      return type;
  }
}

export function DashboardHomePage() {
  const { data, isLoading, isError, error, refetch } = useDashboardStatistics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-500" />
        <p className="font-semibold text-red-800 mb-1">Couldn’t load dashboard</p>
        <p className="text-sm text-red-600 mb-4">{handleApiError(error).message}</p>
        <Button variant="outline" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const stats = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Your resume activity at a glance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/resumes">View resumes</Link>
          </Button>
          <CreateResumeDialog />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              Total resumes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.totalResumes ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-600" />
              Versions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.totalVersions ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-purple-600" />
              Avg ATS score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.averageAtsScore == null
                ? '—'
                : Math.round(stats.averageAtsScore)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            Recent activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!stats?.recentActivity?.length ? (
            <p className="text-sm text-gray-500">
              No recent activity yet. Create a resume to get started.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {stats.recentActivity.slice(0, 10).map((item) => (
                <li
                  key={`${item.type}-${item.id}`}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatActivityType(item.type)}
                    </p>
                  </div>
                  <time className="text-xs text-gray-400 shrink-0">
                    {new Date(item.occurredAt).toLocaleString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
