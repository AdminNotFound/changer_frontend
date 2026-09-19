'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleApiError } from '@/lib/api/error';
import { CreateResumeDialog } from '@/features/resume/components/create-resume-dialog';
import { useDashboardStatistics } from '../hooks/use-dashboard-statistics';
import { DashboardActivity } from './dashboard-activity';
import { DashboardCharts } from './dashboard-charts';
import { DashboardSkeleton } from './dashboard-skeleton';
import { DashboardStatCards } from './dashboard-stat-cards';

export function DashboardHomePage() {
  const { data, isLoading, isError, error, refetch } = useDashboardStatistics();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-500" />
        <p className="mb-1 font-semibold text-red-800">Couldn’t load dashboard</p>
        <p className="mb-4 text-sm text-red-600">{handleApiError(error).message}</p>
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
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
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

      <DashboardStatCards
        totalResumes={stats?.totalResumes ?? 0}
        totalVersions={stats?.totalVersions ?? 0}
        averageAtsScore={stats?.averageAtsScore ?? null}
      />

      <DashboardCharts averageAtsScore={stats?.averageAtsScore ?? null} />

      <DashboardActivity
        items={stats?.recentActivity ?? []}
        totalResumes={stats?.totalResumes ?? 0}
      />
    </div>
  );
}
