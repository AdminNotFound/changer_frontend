'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleApiError } from '@/lib/api/error';
import { useUIStore } from '@/stores/ui-store';
import { jobPollInterval } from '@/lib/api/job-polling';
import type { TailorEnqueueInput } from '@/types/resume-tailoring';
import { tailoringApi } from '../api/tailoring-api';
import { tailoringKeys } from './tailoring-keys';

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
    refetchInterval: (query) => jobPollInterval(query.state.data?.status),
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
