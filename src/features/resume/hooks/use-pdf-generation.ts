'use client';

import { useCallback, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { handleApiError } from '@/lib/api/error';
import {
  isJobPollingStatus,
  JOB_POLL_INTERVAL_MS,
  MAX_JOB_POLL_ATTEMPTS,
} from '@/lib/api/job-polling';
import { downloadBlob, revokeBlobUrl } from '@/lib/utils/download-blob';
import { useUIStore } from '@/stores/ui-store';
import type {
  PdfFlowResult,
  PdfGenerationMode,
  PdfGenerationStatus,
  PdfSource,
} from '@/types/resume-pdf';
import { pdfApi } from '../api/pdf-api';
import { enqueuePdfJob, jobToPdfFlowResult } from '../services/pdf-generation';
import { pdfKeys } from './resume-keys';

type PdfQueryData =
  | { kind: 'polling' }
  | { kind: 'preview'; result: PdfFlowResult }
  | { kind: 'downloaded'; fileName: string };

type UsePdfGenerationOptions = {
  resumeId: string;
  source?: PdfSource;
  flushSave?: () => Promise<unknown>;
  hasUnsavedChanges?: boolean;
};

export function usePdfGeneration({
  resumeId,
  source = 'draft',
  flushSave,
  hasUnsavedChanges = false,
}: UsePdfGenerationOptions) {
  const addToast = useUIStore((s) => s.addToast);
  const [jobId, setJobId] = useState<string | null>(null);
  const [enqueueError, setEnqueueError] = useState<string | null>(null);
  const previewBlobUrlRef = useRef<string | null>(null);
  const pollAttemptsRef = useRef(0);
  const modeRef = useRef<PdfGenerationMode | null>(null);

  const clearPreviewBlob = useCallback(() => {
    revokeBlobUrl(previewBlobUrlRef.current);
    previewBlobUrlRef.current = null;
  }, []);

  const jobQuery = useQuery({
    queryKey: pdfKeys.job(jobId ?? ''),
    queryFn: async (): Promise<PdfQueryData> => {
      pollAttemptsRef.current += 1;
      if (pollAttemptsRef.current > MAX_JOB_POLL_ATTEMPTS) {
        throw new Error('PDF generation timed out. Please try again.');
      }

      const job = await pdfApi.getJobStatus(jobId!);

      if (job.status === 'failed') {
        throw new Error(job.failedReason || 'PDF generation failed');
      }

      if (job.status === 'completed') {
        const result = jobToPdfFlowResult(job);
        if (modeRef.current === 'download') {
          downloadBlob(result.blob, result.fileName);
          revokeBlobUrl(result.blobUrl);
          addToast({ type: 'success', message: 'PDF downloaded successfully' });
          return { kind: 'downloaded', fileName: result.fileName };
        }

        revokeBlobUrl(previewBlobUrlRef.current);
        previewBlobUrlRef.current = result.blobUrl;
        addToast({ type: 'success', message: 'PDF ready to preview' });
        return { kind: 'preview', result };
      }

      if (!isJobPollingStatus(job.status)) {
        throw new Error('PDF generation failed');
      }

      return { kind: 'polling' };
    },
    enabled: Boolean(jobId),
    retry: false,
    refetchInterval: (query) => {
      if (query.state.status === 'error') return false;
      const data = query.state.data;
      if (data?.kind === 'preview' || data?.kind === 'downloaded') return false;
      return JOB_POLL_INTERVAL_MS;
    },
  });

  const preview =
    jobQuery.data?.kind === 'preview' ? jobQuery.data.result : null;
  const queryError = jobQuery.isError
    ? handleApiError(jobQuery.error).message
    : null;
  const error = enqueueError ?? queryError;
  const status: PdfGenerationStatus = error
    ? 'error'
    : jobQuery.data?.kind === 'preview' || jobQuery.data?.kind === 'downloaded'
      ? 'success'
      : jobId
        ? 'generating'
        : 'idle';

  const reset = useCallback(() => {
    clearPreviewBlob();
    setEnqueueError(null);
    setJobId(null);
    modeRef.current = null;
    pollAttemptsRef.current = 0;
  }, [clearPreviewBlob]);

  const run = useCallback(
    async (nextMode: PdfGenerationMode) => {
      setEnqueueError(null);
      pollAttemptsRef.current = 0;
      modeRef.current = nextMode;
      setJobId(null);

      try {
        const nextJobId = await enqueuePdfJob({
          resumeId,
          mode: nextMode,
          source,
          flushSave,
          hasUnsavedChanges,
        });
        setJobId(nextJobId);
      } catch (err) {
        const apiError = handleApiError(err);
        setEnqueueError(apiError.message);
        addToast({ type: 'error', message: apiError.message });
      }
    },
    [resumeId, source, flushSave, hasUnsavedChanges, addToast]
  );

  const previewPdf = useCallback(() => run('preview'), [run]);
  const downloadPdf = useCallback(() => run('download'), [run]);

  const downloadPreview = useCallback(() => {
    if (!preview) return;
    downloadBlob(preview.blob, preview.fileName);
    addToast({ type: 'success', message: 'PDF downloaded successfully' });
  }, [preview, addToast]);

  return {
    status,
    error,
    preview,
    previewPdf,
    downloadPdf,
    downloadPreview,
    reset,
    isGenerating: status === 'generating',
  };
}
