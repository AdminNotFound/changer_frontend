'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { handleApiError } from '@/lib/api/error';
import { useCompareVersions } from '@/features/resume/hooks/use-version-history';
import { formatDiffValue } from '@/features/resume/utils/version-format';
import type { DiffEntry, PublicVersion } from '@/types/resume-version';
import { cn } from '@/lib/utils/cn';

type TailorVersionBarProps = {
  resumeId: string;
  version: PublicVersion | null;
  versionCreated: boolean;
  fromVersionNumber: number;
};

export function TailorVersionBar({
  resumeId,
  version,
  versionCreated,
  fromVersionNumber,
}: TailorVersionBarProps) {
  const toVersion = version?.versionNumber ?? null;
  const canCompare =
    fromVersionNumber > 0 && toVersion !== null && fromVersionNumber !== toVersion;

  const params = canCompare
    ? { fromVersion: fromVersionNumber, toVersion }
    : null;

  const { data, isLoading, isError, error } = useCompareVersions(
    resumeId,
    params,
    canCompare
  );

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base">Saved version</CardTitle>
          <p className="mt-1 text-sm text-gray-500">
            {versionCreated && version
              ? `Version ${version.versionNumber} was saved to this resume.`
              : version
                ? `Latest saved version is ${version.versionNumber}.`
                : 'The tailored draft was saved, but no new version was created.'}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href={`/edit/${resumeId}`}>
            <ExternalLink className="mr-1.5 h-4 w-4" />
            Open in editor
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {version ? <Badge variant="secondary">v{version.versionNumber}</Badge> : null}
          {versionCreated ? <Badge variant="success">New version created</Badge> : null}
          {canCompare ? (
            <Badge variant="outline">
              Compared v{fromVersionNumber} → v{toVersion}
            </Badge>
          ) : null}
        </div>

        {canCompare ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Review changes</p>
            {isLoading ? (
              <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                Loading field-level diff…
              </div>
            ) : isError ? (
              <p className="text-sm text-red-600">{handleApiError(error).message}</p>
            ) : (data?.diff ?? []).length === 0 ? (
              <p className="text-sm text-gray-500">No field-level differences returned.</p>
            ) : (
              <ul className="space-y-2">
                {(data?.diff ?? []).map((entry) => (
                  <DiffRow key={`${entry.type}-${entry.path}`} entry={entry} />
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function DiffRow({ entry }: { entry: DiffEntry }) {
  const borderColor =
    entry.type === 'added'
      ? 'border-emerald-500 bg-emerald-50/50'
      : entry.type === 'removed'
        ? 'border-red-500 bg-red-50/50'
        : 'border-amber-500 bg-amber-50/50';

  const labelColor =
    entry.type === 'added'
      ? 'text-emerald-700 bg-emerald-100'
      : entry.type === 'removed'
        ? 'text-red-700 bg-red-100'
        : 'text-amber-700 bg-amber-100';

  return (
    <li className={cn('rounded-xl border-l-4 px-3 py-2.5', borderColor)}>
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase', labelColor)}>
          {entry.type}
        </span>
        <code className="font-mono text-xs text-gray-600">{entry.path}</code>
      </div>
      {entry.type === 'added' ? (
        <pre className="whitespace-pre-wrap break-words font-sans text-xs text-gray-800">
          {formatDiffValue(entry.after)}
        </pre>
      ) : entry.type === 'removed' ? (
        <pre className="whitespace-pre-wrap break-words font-sans text-xs text-gray-800 line-through opacity-70">
          {formatDiffValue(entry.before)}
        </pre>
      ) : (
        <div className="grid gap-2 text-xs sm:grid-cols-2">
          <div>
            <p className="mb-0.5 text-[10px] font-semibold uppercase text-gray-500">Before</p>
            <pre className="whitespace-pre-wrap break-words font-sans text-gray-700">
              {formatDiffValue(entry.before)}
            </pre>
          </div>
          <div>
            <p className="mb-0.5 text-[10px] font-semibold uppercase text-gray-500">After</p>
            <pre className="whitespace-pre-wrap break-words font-sans text-gray-900">
              {formatDiffValue(entry.after)}
            </pre>
          </div>
        </div>
      )}
    </li>
  );
}
