'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Gauge,
  Layers,
  Mail,
  RefreshCw,
  WandSparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCoverLetters } from '@/features/cover-letters/hooks/use-cover-letters';
import { useRecentTailored } from '@/features/tailoring/hooks/use-recent-tailored';
import { formatAverageAtsScore } from '../utils/activity';

const COUNT_QUERY = { page: 1, limit: 1 } as const;

type StatCardProps = {
  label: string;
  icon: React.ReactNode;
  value: string;
  href?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

function StatCard({
  label,
  icon,
  value,
  href,
  isLoading,
  isError,
  onRetry,
}: StatCardProps) {
  const body = (
    <>
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-500">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="mt-1 h-9 w-16" />
        ) : (
          <div className="flex items-end justify-between gap-2">
            <p className="text-3xl font-bold tabular-nums text-gray-900">{value}</p>
            {isError && onRetry ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 px-2 text-gray-500"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onRetry();
                }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="sr-only">Retry {label}</span>
              </Button>
            ) : null}
          </div>
        )}
      </CardContent>
    </>
  );

  if (href && !isError) {
    return (
      <Link href={href} className="block focus-visible:outline-none">
        <Card className="h-full transition-colors hover:border-purple-100 hover:shadow-sm">
          {body}
        </Card>
      </Link>
    );
  }

  return <Card className="h-full">{body}</Card>;
}

type DashboardStatCardsProps = {
  totalResumes: number;
  totalVersions: number;
  averageAtsScore: number | null;
};

export function DashboardStatCards({
  totalResumes,
  totalVersions,
  averageAtsScore,
}: DashboardStatCardsProps) {
  const tailoredQuery = useRecentTailored(COUNT_QUERY);
  const coverLettersQuery = useCoverLetters(COUNT_QUERY);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        label="Total Resumes"
        icon={<FileText className="h-4 w-4 text-purple-600" />}
        value={String(totalResumes)}
        href="/resumes"
      />
      <StatCard
        label="Total Versions"
        icon={<Layers className="h-4 w-4 text-purple-600" />}
        value={String(totalVersions)}
      />
      <StatCard
        label="Average ATS Score"
        icon={<Gauge className="h-4 w-4 text-purple-600" />}
        value={formatAverageAtsScore(averageAtsScore)}
        href="/ats"
      />
      <StatCard
        label="Tailored Resumes"
        icon={<WandSparkles className="h-4 w-4 text-purple-600" />}
        value={
          tailoredQuery.isError
            ? '—'
            : String(tailoredQuery.data?.meta.total ?? 0)
        }
        href="/tailor"
        isLoading={tailoredQuery.isLoading}
        isError={tailoredQuery.isError}
        onRetry={() => void tailoredQuery.refetch()}
      />
      <StatCard
        label="Cover Letters"
        icon={<Mail className="h-4 w-4 text-purple-600" />}
        value={
          coverLettersQuery.isError
            ? '—'
            : String(coverLettersQuery.data?.meta.total ?? 0)
        }
        href="/cover-letters"
        isLoading={coverLettersQuery.isLoading}
        isError={coverLettersQuery.isError}
        onRetry={() => void coverLettersQuery.refetch()}
      />
    </div>
  );
}
