'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Download,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { handleApiError } from '@/lib/api/error';
import { formatVersionDate } from '@/lib/utils/date-format';
import {
  COVER_LETTER_TONE_LABELS,
  type DashboardCoverLetterItem,
} from '@/types/cover-letter';
import {
  useCoverLetters,
  useDeleteCoverLetterMutation,
  useDownloadCoverLetterMutation,
} from '../hooks/use-cover-letters';
import { CoverLetterConfirmDialog } from './cover-letter-confirm-dialog';

type CoverLetterListProps = {
  selectedId: string | null;
  onView: (item: DashboardCoverLetterItem) => void;
  onDeleted: (item: DashboardCoverLetterItem) => void;
};

export function CoverLetterList({ selectedId, onView, onDeleted }: CoverLetterListProps) {
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<DashboardCoverLetterItem | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useCoverLetters({
    page,
    limit: 10,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });
  const downloadMutation = useDownloadCoverLetterMutation();
  const deleteMutation = useDeleteCoverLetterMutation();

  const items = data?.coverLetters ?? [];
  const meta = data?.meta;

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const item = pendingDelete;
    deleteMutation.mutate(
      { resumeId: item.resumeId, coverLetterId: item.id },
      {
        onSuccess: () => {
          setPendingDelete(null);
          onDeleted(item);
        },
      }
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Saved cover letters</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
              <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-red-500" />
              <p className="text-sm font-medium text-red-700">
                {handleApiError(error).message || 'Failed to load cover letters.'}
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
              <p className="text-sm font-medium text-gray-700">No cover letters yet</p>
              <p className="mt-1 text-xs text-gray-500">
                Generated letters will appear here with the resume they were written from.
              </p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-100">
                {items.map((item) => {
                  const selected = item.id === selectedId;
                  return (
                    <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                      <div
                        className={`flex items-start gap-2 rounded-xl px-2 py-2 transition-colors ${
                          selected ? 'bg-purple-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onView(item)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {item.title}
                          </p>
                          <p className="truncate text-xs text-gray-500">{item.resumeTitle}</p>
                          <p className="mt-1 text-xs text-gray-400">
                            Created {formatVersionDate(item.createdAt)}
                          </p>
                          <p className="text-xs text-gray-400">
                            Updated {formatVersionDate(item.updatedAt)}
                          </p>
                        </button>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <div className="flex flex-wrap justify-end gap-1">
                            <Badge variant="outline">
                              {COVER_LETTER_TONE_LABELS[item.tone]}
                            </Badge>
                            <Badge variant={item.status === 'saved' ? 'success' : 'secondary'}>
                              {item.status === 'saved' ? 'Saved' : 'Draft'}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Cover letter actions"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => onView(item)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() =>
                                  downloadMutation.mutate({
                                    resumeId: item.resumeId,
                                    coverLetterId: item.id,
                                    title: item.title,
                                  })
                                }
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-700"
                                onSelect={() => setPendingDelete(item)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {meta && meta.totalPages > 1 ? (
                <div className="flex items-center justify-between gap-3 pt-4">
                  <p className="text-xs text-gray-500">
                    Page {meta.page} of {meta.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={meta.page <= 1 || isFetching}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={meta.page >= meta.totalPages || isFetching}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      <CoverLetterConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete cover letter?"
        description="This permanently removes the letter. You cannot undo this action."
        confirmLabel={deleteMutation.isPending ? 'Deleting…' : 'Delete'}
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
