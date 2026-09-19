'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Mail, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { handleApiError } from '@/lib/api/error';
import { useUIStore } from '@/stores/ui-store';
import { dashboardKeys } from '@/features/resume/hooks/resume-keys';
import type {
  CoverLetterJobStatus,
  CoverLetterTone,
  DashboardCoverLetterItem,
} from '@/types/cover-letter';
import { coverLetterKeys } from '../hooks/cover-letter-keys';
import {
  useCoverLetterJobPolling,
  useGenerateCoverLetterMutation,
  useRegenerateCoverLetterMutation,
  useRetryCoverLetterJobMutation,
} from '../hooks/use-cover-letters';
import { CoverLetterConfirmDialog } from './cover-letter-confirm-dialog';
import { CoverLetterEditor } from './cover-letter-editor';
import { CoverLetterForm, type CoverLetterFormSubmit } from './cover-letter-form';
import { CoverLetterList } from './cover-letter-list';
import { CoverLetterProcessing } from './cover-letter-processing';
import { CoverLetterSafetyBanner } from './cover-letter-safety-banner';

const POLLING_STATUSES: CoverLetterJobStatus[] = [
  'queued',
  'waiting',
  'active',
  'delayed',
];

type SelectedLetter = {
  resumeId: string;
  coverLetterId: string;
  resumeTitle: string;
};

type JobKind = 'generate' | 'regenerate';

type PendingAction =
  | { type: 'view'; item: DashboardCoverLetterItem }
  | { type: 'generate'; payload: CoverLetterFormSubmit }
  | { type: 'regenerate'; tone: CoverLetterTone };

export function CoverLettersPage() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  const generate = useGenerateCoverLetterMutation();
  const regenerate = useRegenerateCoverLetterMutation();
  const retryJob = useRetryCoverLetterJobMutation();

  const [jobId, setJobId] = useState<string | null>(null);
  const [jobKind, setJobKind] = useState<JobKind>('generate');
  const [selected, setSelected] = useState<SelectedLetter | null>(null);
  const [lastGenerate, setLastGenerate] = useState<CoverLetterFormSubmit | null>(null);
  const [lastRegenerateTone, setLastRegenerateTone] = useState<CoverLetterTone>('formal');
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const handledJobRef = useRef<string | null>(null);
  const dirtyRef = useRef(false);

  const jobQuery = useCoverLetterJobPolling(jobId);
  const job = jobQuery.data ?? null;
  const result = job?.status === 'completed' ? job.result : null;
  const isPolling = Boolean(job && POLLING_STATUSES.includes(job.status));
  const isBusy = generate.isPending || regenerate.isPending || retryJob.isPending || isPolling;

  const handleDirtyChange = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  useEffect(() => {
    if (!job || job.status !== 'completed' || !job.result) return;
    if (handledJobRef.current === job.jobId) return;
    handledJobRef.current = job.jobId;

    const letter = job.result;
    queryClient.setQueryData(coverLetterKeys.detail(letter.resumeId, letter.id), letter);
    void queryClient.invalidateQueries({ queryKey: coverLetterKeys.lists() });
    void queryClient.invalidateQueries({ queryKey: dashboardKeys.statistics() });

    setSelected((current) => ({
      resumeId: letter.resumeId,
      coverLetterId: letter.id,
      resumeTitle: current?.resumeTitle ?? lastGenerate?.resumeTitle ?? 'Resume',
    }));
    dirtyRef.current = false;
    addToast({
      type: 'success',
      message: jobKind === 'regenerate' ? 'Cover letter regenerated' : 'Cover letter generated',
    });
  }, [job, queryClient, addToast, jobKind, lastGenerate]);

  const startGenerate = async (payload: CoverLetterFormSubmit) => {
    setLastGenerate(payload);
    setJobKind('generate');
    setJobId(null);
    handledJobRef.current = null;
    try {
      const enqueued = await generate.mutateAsync({
        resumeId: payload.resumeId,
        input: payload.input,
      });
      setSelected({
        resumeId: payload.resumeId,
        coverLetterId: '',
        resumeTitle: payload.resumeTitle,
      });
      setJobId(enqueued.jobId);
    } catch (error) {
      const message = handleApiError(error).message;
      addToast({ type: 'error', message });
    }
  };

  const startRegenerate = async (tone: CoverLetterTone) => {
    if (!selected?.coverLetterId) return;
    setLastRegenerateTone(tone);
    setJobKind('regenerate');
    setJobId(null);
    handledJobRef.current = null;
    try {
      const enqueued = await regenerate.mutateAsync({
        resumeId: selected.resumeId,
        coverLetterId: selected.coverLetterId,
        input: { tone },
      });
      setJobId(enqueued.jobId);
    } catch (error) {
      const message = handleApiError(error).message;
      addToast({ type: 'error', message });
    }
  };

  const selectLetter = (item: DashboardCoverLetterItem) => {
    generate.reset();
    regenerate.reset();
    setJobId(null);
    handledJobRef.current = null;
    setSelected({
      resumeId: item.resumeId,
      coverLetterId: item.id,
      resumeTitle: item.resumeTitle,
    });
    dirtyRef.current = false;
  };

  const requestView = (item: DashboardCoverLetterItem) => {
    if (selected?.coverLetterId === item.id) return;
    if (dirtyRef.current) {
      setPendingAction({ type: 'view', item });
      return;
    }
    selectLetter(item);
  };

  const requestGenerate = (payload: CoverLetterFormSubmit) => {
    if (dirtyRef.current) {
      setPendingAction({ type: 'generate', payload });
      return;
    }
    void startGenerate(payload);
  };

  const requestRegenerate = (input: { tone: CoverLetterTone }) => {
    if (dirtyRef.current) {
      setPendingAction({ type: 'regenerate', tone: input.tone });
      return;
    }
    void startRegenerate(input.tone);
  };

  const confirmPending = () => {
    if (!pendingAction) return;
    const action = pendingAction;
    setPendingAction(null);
    dirtyRef.current = false;
    if (action.type === 'view') {
      selectLetter(action.item);
      return;
    }
    if (action.type === 'generate') {
      void startGenerate(action.payload);
      return;
    }
    void startRegenerate(action.tone);
  };

  const handleRetry = async () => {
    if (jobId && job?.status === 'failed') {
      try {
        await retryJob.mutateAsync(jobId);
        return;
      } catch {
        // Re-enqueue if the job cannot be retried.
      }
    }
    if (jobKind === 'regenerate' && selected?.coverLetterId) {
      await startRegenerate(lastRegenerateTone);
      return;
    }
    if (lastGenerate) {
      await startGenerate(lastGenerate);
    }
  };

  const handleDeleted = (item?: DashboardCoverLetterItem) => {
    const deletedId = item?.id ?? selected?.coverLetterId;
    if (deletedId && selected?.coverLetterId === deletedId) {
      setSelected(null);
      dirtyRef.current = false;
      setJobId(null);
    }
  };

  const enqueueError = generate.isError ? handleApiError(generate.error).message : null;
  const regenerateError = regenerate.isError
    ? handleApiError(regenerate.error).message
    : null;
  const pollError = jobQuery.isError ? handleApiError(jobQuery.error).message : null;
  const failedReason = job?.status === 'failed' ? job.failedReason : null;
  const errorMessage = enqueueError ?? regenerateError ?? pollError ?? failedReason;
  const showEditor = Boolean(selected?.coverLetterId) && !isBusy && !errorMessage;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Cover Letters</h2>
        <p className="mt-1 text-sm text-gray-500">
          Generate a letter from a saved resume and job description, then edit, save, or download
          the PDF.
        </p>
      </div>

      <CoverLetterSafetyBanner />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_1fr]">
        <div className="space-y-6">
          <CoverLetterForm onSubmit={requestGenerate} isSubmitting={isBusy} />
          <CoverLetterList
            selectedId={selected?.coverLetterId ?? null}
            onView={requestView}
            onDeleted={handleDeleted}
          />
        </div>

        <div>
          {isBusy ? (
            <CoverLetterProcessing mode={jobKind} />
          ) : errorMessage && !result ? (
            <Card className="border-red-100 bg-red-50/60">
              <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 pt-6 text-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <p className="font-semibold text-red-800">
                  {jobKind === 'regenerate'
                    ? 'Couldn’t regenerate cover letter'
                    : 'Couldn’t generate cover letter'}
                </p>
                <p className="max-w-md text-sm text-red-600">{errorMessage}</p>
                {lastGenerate || selected?.coverLetterId ? (
                  <Button type="button" variant="outline" onClick={() => void handleRetry()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ) : showEditor && selected ? (
            <CoverLetterEditor
              key={`${selected.resumeId}-${selected.coverLetterId}`}
              resumeId={selected.resumeId}
              coverLetterId={selected.coverLetterId}
              resumeTitle={selected.resumeTitle}
              onDirtyChange={handleDirtyChange}
              onDeleted={() => handleDeleted()}
              onRegenerate={requestRegenerate}
              isRegenerating={isBusy}
            />
          ) : (
            <Card>
              <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-2 pt-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <Mail className="h-6 w-6" />
                </div>
                <p className="font-semibold text-gray-900">No cover letter selected</p>
                <p className="max-w-sm text-sm text-gray-500">
                  Generate a new letter or open one from the list to review and edit it here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <CoverLetterConfirmDialog
        open={Boolean(pendingAction)}
        title="Discard unsaved changes?"
        description="You have unsaved edits. Continue without saving this cover letter?"
        confirmLabel="Discard"
        destructive
        onConfirm={confirmPending}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
