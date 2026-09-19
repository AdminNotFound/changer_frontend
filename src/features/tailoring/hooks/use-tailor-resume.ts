'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleApiError } from '@/lib/api/error';
import { useUIStore } from '@/stores/ui-store';
import type { TailorEnqueueInput, TailorJobStatus } from '@/types/resume-tailoring';
import { tailoringApi } from '../api/tailoring-api';
import { tailoringKeys } from './tailoring-keys';

const POLLING_STATUSES: TailorJobStatus[] = [
  'queued',
  'waiting',
  'active',
  'delayed',
];

export function useEnqueueTailorMutation() {
  return useMutation({
    mutationFn: ({
      resumeId,
      input,
    }: {
      resumeId: string;
      input: TailorEnqueueInput;
    }) => tailoringApi.enqueueTailor(resumeId, input),
  });
}

export function useTailorJobPolling(jobId: string | null, enabled = true) {
  return useQuery({
    queryKey: tailoringKeys.job(jobId ?? ''),
    queryFn: () => tailoringApi.getJobStatus(jobId!),
    enabled: Boolean(jobId) && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status) return 1500;
      return POLLING_STATUSES.includes(status) ? 1500 : false;
    },
  });
}

export function useRetryTailorJobMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: (jobId: string) => tailoringApi.retryJob(jobId),
    onSuccess: (job) => {
      queryClient.setQueryData(tailoringKeys.job(job.jobId), job);
      addToast({ type: 'info', message: 'Tailoring job retried' });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        message: handleApiError(error).message || 'Failed to retry tailoring job',
      });
    },
  });
}
