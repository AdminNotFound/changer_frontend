'use client';

import React from 'react';
import Link from 'next/link';
import {
  FilePenLine,
  Gauge,
  Layers,
  Mail,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/common/empty-state';
import { formatVersionDate } from '@/features/resume/utils/version-format';
import { CreateResumeDialog } from '@/features/resume/components/create-resume-dialog';
import type { RecentActivityItem, RecentActivityType } from '@/types/resume';
import { formatActivityType, getActivityHref } from '../utils/activity';

const ACTIVITY_ICONS: Record<RecentActivityType, React.ReactNode> = {
  resume_updated: <FilePenLine className="h-4 w-4" />,
  version_created: <Layers className="h-4 w-4" />,
  ats_scored: <Gauge className="h-4 w-4" />,
  tailored: <WandSparkles className="h-4 w-4" />,
  cover_letter: <Mail className="h-4 w-4" />,
};

type DashboardActivityProps = {
  items: RecentActivityItem[];
  totalResumes: number;
};

export function DashboardActivity({ items, totalResumes }: DashboardActivityProps) {
  const isBrandNew = totalResumes === 0 && items.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-purple-600" />
          Recent activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isBrandNew ? (
          <div>
            <EmptyState
              title="No activity yet"
              description="Create your first resume to start tracking edits, ATS analyses, tailoring, and cover letters."
              icon={<Sparkles className="h-7 w-7" />}
            />
            <div className="flex justify-center">
              <CreateResumeDialog triggerLabel="Create your first resume" />
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-8 text-center">
            <Sparkles className="mb-2 h-6 w-6 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">No recent activity</p>
            <p className="mt-1 text-xs text-gray-500">
              Updates, analyses, tailored versions, and cover letters will show up here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((item) => {
              const href = getActivityHref(item);
              const icon =
                ACTIVITY_ICONS[item.type] ?? <Sparkles className="h-4 w-4" />;

              const row = (
                <>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{formatActivityType(item.type)}</Badge>
                    </div>
                  </div>
                  <time className="shrink-0 text-xs text-gray-400">
                    {formatVersionDate(item.occurredAt)}
                  </time>
                </>
              );

              return (
                <li key={`${item.type}-${item.id}`} className="first:pt-0 last:pb-0">
                  {href ? (
                    <Link
                      href={href}
                      className="flex items-center gap-3 py-3 rounded-lg -mx-1 px-1 hover:bg-gray-50 transition-colors"
                    >
                      {row}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 py-3">{row}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
