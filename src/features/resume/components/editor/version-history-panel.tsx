'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  GitCompare,
  History,
  MoreVertical,
  RotateCcw,
  Trash2,
  X,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/common/empty-state';
import { handleApiError } from '@/lib/api/error';
import type { VersionHistoryItem } from '@/types/resume-version';
import {
  useDeleteVersionMutation,
  useVersionHistory,
} from '@/features/resume/hooks/use-version-history';
import { formatVersionDate } from '@/features/resume/utils/version-format';
import { ConfirmRemoveDialog } from './shared/confirm-remove-dialog';
import { VersionCompareDialog } from './version-compare-dialog';
import { VersionRestoreDialog } from './version-restore-dialog';
import { VersionViewDialog } from './version-view-dialog';

type VersionHistoryPanelProps = {
  resumeId: string;
  templateId: string;
  currentVersionNumber: number;
  open: boolean;
  onClose: () => void;
  onRestored: (resume: import('@/types/resume').PublicResume) => void;
};

export function VersionHistoryPanel({
  resumeId,
  templateId,
  currentVersionNumber,
  open,
  onClose,
  onRestored,
}: VersionHistoryPanelProps) {
  const { data: versions, isLoading, isError, error, refetch } =
    useVersionHistory(resumeId, open);
  const deleteMutation = useDeleteVersionMutation();

  const [viewVersionId, setViewVersionId] = useState<string | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<VersionHistoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VersionHistoryItem | null>(null);
  const [compareFrom, setCompareFrom] = useState<number | null>(null);
  const [compareTo, setCompareTo] = useState<number | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);

  if (!open) return null;

  const toggleCompareSelect = (versionNumber: number) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(versionNumber)) {
        return prev.filter((v) => v !== versionNumber);
      }
      if (prev.length >= 2) {
        return [prev[1], versionNumber];
      }
      return [...prev, versionNumber];
    });
  };

  const startCompare = () => {
    if (selectedForCompare.length !== 2) return;
    const [a, b] = [...selectedForCompare].sort((x, y) => x - y);
    setCompareFrom(a);
    setCompareTo(b);
    setCompareOpen(true);
    setCompareMode(false);
    setSelectedForCompare([]);
  };

  const handleCompareWith = (versionNumber: number) => {
    if (currentVersionNumber > 0) {
      const [from, to] =
        versionNumber < currentVersionNumber
          ? [versionNumber, currentVersionNumber]
          : [currentVersionNumber, versionNumber];
      setCompareFrom(from);
      setCompareTo(to);
      setCompareOpen(true);
    } else if (versions && versions.length >= 2) {
      setCompareMode(true);
      setSelectedForCompare([versionNumber]);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 lg:bg-black/20"
        onClick={onClose}
        aria-hidden
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-gray-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <History className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-900">Version History</h2>
              <p className="text-xs text-gray-500 truncate">
                {currentVersionNumber > 0
                  ? `Current: v${currentVersionNumber}`
                  : 'No published versions yet'}
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {compareMode ? (
          <div className="border-b border-purple-100 bg-purple-50 px-4 py-3 space-y-2">
            <p className="text-xs font-medium text-purple-800">
              Select two versions to compare ({selectedForCompare.length}/2)
            </p>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => {
                setCompareMode(false);
                setSelectedForCompare([]);
              }}>
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={selectedForCompare.length !== 2}
                onClick={startCompare}
              >
                <GitCompare className="h-3.5 w-3.5 mr-1.5" />
                Compare
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-b border-gray-50 px-4 py-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => setCompareMode(true)}
            >
              <GitCompare className="h-3.5 w-3.5 mr-1.5" />
              Compare versions
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center space-y-3">
              <AlertTriangle className="h-6 w-6 text-red-500 mx-auto" />
              <p className="text-sm text-red-700">{handleApiError(error).message}</p>
              <Button type="button" size="sm" variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : !versions?.length ? (
            <EmptyState
              title="No versions yet"
              description="Versions are created when you publish or restore changes."
            />
          ) : (
            versions.map((version) => {
              const isCurrent = version.versionNumber === currentVersionNumber;
              const isSelected = selectedForCompare.includes(version.versionNumber);

              return (
                <div
                  key={version.id}
                  className={`rounded-xl border p-3 transition-colors ${
                    isSelected
                      ? 'border-purple-300 bg-purple-50/50'
                      : 'border-gray-100 bg-gray-50/30 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      {compareMode ? (
                        <button
                          type="button"
                          className="flex items-center gap-2 text-left w-full"
                          onClick={() => toggleCompareSelect(version.versionNumber)}
                        >
                          <input
                            type="checkbox"
                            readOnly
                            checked={isSelected}
                            className="rounded border-gray-300 text-purple-600"
                          />
                          <span className="text-sm font-bold text-gray-900">
                            Version {version.versionNumber}
                          </span>
                        </button>
                      ) : (
                        <p className="text-sm font-bold text-gray-900">
                          Version {version.versionNumber}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatVersionDate(version.createdAt)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {version.changeSummary || 'No summary'}
                      </p>
                      <div className="mt-2">
                        {isCurrent ? (
                          <Badge variant="success">Current</Badge>
                        ) : null}
                      </div>
                    </div>

                    {!compareMode ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setViewVersionId(version.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleCompareWith(version.versionNumber)}>
                            <GitCompare className="h-4 w-4 mr-2" />
                            Compare
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setRestoreTarget(version)}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-700"
                            onSelect={() => setDeleteTarget(version)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      <VersionViewDialog
        resumeId={resumeId}
        versionId={viewVersionId}
        templateId={templateId}
        open={Boolean(viewVersionId)}
        onOpenChange={(next) => !next && setViewVersionId(null)}
      />

      <VersionCompareDialog
        resumeId={resumeId}
        fromVersion={compareFrom}
        toVersion={compareTo}
        open={compareOpen}
        onOpenChange={setCompareOpen}
      />

      <VersionRestoreDialog
        resumeId={resumeId}
        versionId={restoreTarget?.id ?? null}
        versionNumber={restoreTarget?.versionNumber ?? null}
        open={Boolean(restoreTarget)}
        onOpenChange={(next) => !next && setRestoreTarget(null)}
        onRestored={onRestored}
      />

      <ConfirmRemoveDialog
        open={Boolean(deleteTarget)}
        title={`Delete version ${deleteTarget?.versionNumber ?? ''}?`}
        description={
          deleteTarget?.versionNumber === currentVersionNumber
            ? 'This is the current version. Deleting it will update your resume version number.'
            : 'This version will be permanently removed.'
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate({ resumeId, versionId: deleteTarget.id });
          }
          setDeleteTarget(null);
        }}
      />
    </>
  );
}
