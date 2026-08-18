'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ChevronLeft, ChevronRight, Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/common/empty-state';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { handleApiError } from '@/lib/api/error';
import type { ResumeSortBy, SortOrder } from '@/types/resume';
import { useMyResumes } from '../hooks/use-resumes';
import { CreateResumeDialog } from './create-resume-dialog';
import { ResumeCard } from './resume-card';
import { ResumeListSkeleton } from './resume-list-skeleton';

const SORT_OPTIONS: Array<{ value: ResumeSortBy; label: string }> = [
  { value: 'updatedAt', label: 'Last updated' },
  { value: 'lastEditedAt', label: 'Last edited' },
  { value: 'createdAt', label: 'Created' },
  { value: 'title', label: 'Title' },
];

export function ResumeListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<ResumeSortBy>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const debouncedSearch = useDebouncedValue(search, 350);

  const query = useMemo(
    () => ({
      page,
      limit: 9,
      q: debouncedSearch.trim() || undefined,
      sortBy,
      sortOrder,
    }),
    [page, debouncedSearch, sortBy, sortOrder]
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useMyResumes(query);

  const resumes = data?.resumes ?? [];
  const meta = data?.meta;
  const errorMessage = isError ? handleApiError(error).message : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            My Resumes
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create a base resume, then open it to edit and tailor for jobs.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/resumes/import">
              <Upload className="h-4 w-4 mr-2" />
              Import resume
            </Link>
          </Button>
          <CreateResumeDialog />
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as ResumeSortBy);
              setPage(1);
            }}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as SortOrder);
              setPage(1);
            }}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Sort order"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <ResumeListSkeleton />
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-500" />
          <p className="font-semibold text-red-800 mb-1">Couldn’t load resumes</p>
          <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      ) : resumes.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            title={debouncedSearch ? 'No matching resumes' : 'No resumes yet'}
            description={
              debouncedSearch
                ? 'Try a different search term, or create a new resume.'
                : 'Create your first resume to start editing, scoring, and tailoring.'
            }
            icon={<Search className="h-7 w-7" />}
          />
          {!debouncedSearch && (
            <div className="flex justify-center">
              <CreateResumeDialog triggerLabel="Create your first resume" />
            </div>
          )}
        </div>
      ) : (
        <>
          <div
            className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${
              isFetching ? 'opacity-70' : ''
            }`}
          >
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 pt-2">
              <p className="text-xs text-gray-500">
                Page {meta.page} of {meta.totalPages} · {meta.total} total
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.totalPages || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
