'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { handleApiError } from '@/lib/api/error';
import type { DiffEntry } from '@/types/resume-version';
import { useCompareVersions } from '@/features/resume/hooks/use-version-history';
import { formatDiffValue, formatVersionDate } from '@/features/resume/utils/version-format';
import { cn } from '@/lib/utils/cn';

type VersionCompareDialogProps = {
  resumeId: string;
  fromVersion: number | null;
  toVersion: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

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
    <div className={cn('rounded-xl border-l-4 px-4 py-3', borderColor)}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase', labelColor)}>
          {entry.type}
        </span>
        <code className="text-xs text-gray-600 font-mono">{entry.path}</code>
      </div>
      {entry.type === 'added' ? (
        <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words font-sans">
          {formatDiffValue(entry.after)}
        </pre>
      ) : entry.type === 'removed' ? (
        <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words font-sans line-through opacity-70">
          {formatDiffValue(entry.before)}
        </pre>
      ) : (
        <div className="space-y-2 text-xs">
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">Before</p>
            <pre className="whitespace-pre-wrap break-words font-sans text-gray-700">
              {formatDiffValue(entry.before)}
            </pre>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase mb-0.5">After</p>
            <pre className="whitespace-pre-wrap break-words font-sans text-gray-900">
              {formatDiffValue(entry.after)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export function VersionCompareDialog({
  resumeId,
  fromVersion,
  toVersion,
  open,
  onOpenChange,
}: VersionCompareDialogProps) {
  const params =
    fromVersion !== null && toVersion !== null
      ? { fromVersion, toVersion }
      : null;

  const { data, isLoading, isError, error } = useCompareVersions(
    resumeId,
    params,
    open && Boolean(params)
  );

  const diff = data?.diff ?? [];
  const grouped = {
    added: diff.filter((d) => d.type === 'added'),
    removed: diff.filter((d) => d.type === 'removed'),
    changed: diff.filter((d) => d.type === 'changed'),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Compare versions</DialogTitle>
          <DialogDescription>
            {fromVersion !== null && toVersion !== null
              ? `v${fromVersion} → v${toVersion}`
              : 'Select two versions to compare'}
          </DialogDescription>
        </DialogHeader>

        {data ? (
          <div className="flex flex-wrap gap-2 pb-2">
            <Badge variant="outline">
              From v{data.from.versionNumber} ({formatVersionDate(data.from.createdAt)})
            </Badge>
            <Badge variant="outline">
              To v{data.to.versionNumber} ({formatVersionDate(data.to.createdAt)})
            </Badge>
            <Badge variant="secondary">{diff.length} change(s)</Badge>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto min-h-0 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {handleApiError(error).message}
            </div>
          ) : data && diff.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No differences between these versions.
            </p>
          ) : (
            <>
              {grouped.added.length > 0 ? (
                <section className="space-y-2">
                  <h3 className="text-xs font-bold text-emerald-700 uppercase">
                    Added ({grouped.added.length})
                  </h3>
                  {grouped.added.map((entry, i) => (
                    <DiffRow key={`added-${entry.path}-${i}`} entry={entry} />
                  ))}
                </section>
              ) : null}
              {grouped.removed.length > 0 ? (
                <section className="space-y-2">
                  <h3 className="text-xs font-bold text-red-700 uppercase">
                    Removed ({grouped.removed.length})
                  </h3>
                  {grouped.removed.map((entry, i) => (
                    <DiffRow key={`removed-${entry.path}-${i}`} entry={entry} />
                  ))}
                </section>
              ) : null}
              {grouped.changed.length > 0 ? (
                <section className="space-y-2">
                  <h3 className="text-xs font-bold text-amber-700 uppercase">
                    Changed ({grouped.changed.length})
                  </h3>
                  {grouped.changed.map((entry, i) => (
                    <DiffRow key={`changed-${entry.path}-${i}`} entry={entry} />
                  ))}
                </section>
              ) : null}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
