'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleApiError } from '@/lib/api/error';
import { downloadBlob } from '@/lib/utils/download-blob';
import { useUIStore } from '@/stores/ui-store';
import { jobPollInterval } from '@/lib/api/job-polling';
import { dashboardKeys } from '@/features/dashboard/hooks/dashboard-keys';
import type {
  CoverLettersQuery,
  GenerateCoverLetterInput,
  PublicCoverLetter,
  RegenerateCoverLetterInput,
  SaveCoverLetterInput,
} from '@/types/cover-letter';
import { coverLetterApi } from '../api/cover-letter-api';
import { coverLetterFileName } from '../utils/file-name';
import { coverLetterKeys } from './cover-letter-keys';

export function useCoverLetters(query: CoverLettersQuery = {}) {
  return useQuery({
    queryKey: coverLetterKeys.list(query as Record<string, unknown>),
    queryFn: () => coverLetterApi.list(query),
    placeholderData: (previous) => previous,
  });
}

export function useCoverLetter(
  resumeId: string | null,
  coverLetterId: string | null,
  enabled = true
) {
  return useQuery({
    queryKey: coverLetterKeys.detail(resumeId ?? '', coverLetterId ?? ''),
    queryFn: () => coverLetterApi.getById(resumeId!, coverLetterId!),
    enabled: Boolean(resumeId && coverLetterId) && enabled,
  });
}

export function useGenerateCoverLetterMutation() {
  return useMutation({
    mutationFn: ({
      resumeId,
      input,
    }: {
      resumeId: string;
      input: GenerateCoverLetterInput;
    }) => coverLetterApi.generate(resumeId, input),
  });
}

export function useRegenerateCoverLetterMutation() {
  return useMutation({
    mutationFn: ({
      resumeId,
      coverLetterId,
      input,
    }: {
      resumeId: string;
      coverLetterId: string;
      input?: RegenerateCoverLetterInput;
    }) => coverLetterApi.regenerate(resumeId, coverLetterId, input),
  });
}

export function useCoverLetterJobPolling(jobId: string | null, enabled = true) {
  return useQuery({
    queryKey: coverLetterKeys.job(jobId ?? ''),
    queryFn: () => coverLetterApi.getJobStatus(jobId!),
    enabled: Boolean(jobId) && enabled,
    refetchInterval: (query) => jobPollInterval(query.state.data?.status),
  });
}

export function useRetryCoverLetterJobMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: (jobId: string) => coverLetterApi.retryJob(jobId),
    onSuccess: (job) => {
      queryClient.setQueryData(coverLetterKeys.job(job.jobId), job);
      addToast({ type: 'info', message: 'Cover letter job retried' });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        message: handleApiError(error).message || 'Failed to retry cover letter job',
      });
    },
  });
}

function cacheCoverLetter(letter: PublicCoverLetter) {
  return coverLetterKeys.detail(letter.resumeId, letter.id);
}

export function useSaveCoverLetterMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({
      resumeId,
      coverLetterId,
      input,
    }: {
      resumeId: string;
      coverLetterId: string;
      input: SaveCoverLetterInput;
    }) => coverLetterApi.save(resumeId, coverLetterId, input),
    onSuccess: (letter) => {
      queryClient.setQueryData(cacheCoverLetter(letter), letter);
      void queryClient.invalidateQueries({ queryKey: coverLetterKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.statistics() });
      addToast({ type: 'success', message: 'Cover letter saved' });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        message: handleApiError(error).message || 'Failed to save cover letter',
      });
    },
  });
}

export function useDeleteCoverLetterMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({
      resumeId,
      coverLetterId,
    }: {
      resumeId: string;
      coverLetterId: string;
    }) => coverLetterApi.remove(resumeId, coverLetterId),
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({
        queryKey: coverLetterKeys.detail(variables.resumeId, variables.coverLetterId),
      });
      void queryClient.invalidateQueries({ queryKey: coverLetterKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.statistics() });
      addToast({ type: 'success', message: 'Cover letter deleted' });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        message: handleApiError(error).message || 'Failed to delete cover letter',
      });
    },
  });
}

export function useDownloadCoverLetterMutation() {
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: async ({
      resumeId,
      coverLetterId,
      title,
    }: {
      resumeId: string;
      coverLetterId: string;
      title: string;
    }) => {
      const blob = await coverLetterApi.download(resumeId, coverLetterId);
      downloadBlob(blob, coverLetterFileName(title));
    },
    onSuccess: () => {
      addToast({ type: 'success', message: 'Cover letter downloaded' });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        message: handleApiError(error).message || 'Failed to download cover letter',
      });
    },
  });
}
