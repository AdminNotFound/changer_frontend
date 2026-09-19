'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { ImportConfirmInput } from '@/types/resume-import';
import { useUIStore } from '@/stores/ui-store';
import { jobPollInterval } from '@/lib/api/job-polling';
import { dashboardKeys } from '@/features/dashboard/hooks/dashboard-keys';
import { importApi } from '../api/import-api';
import { importKeys, resumeKeys } from './resume-keys';

export function useImportPreviewMutation() {
  return useMutation({
    mutationFn: ({
      file,
      onUploadProgress,
    }: {
      file: File;
      onUploadProgress?: (percent: number) => void;
    }) => importApi.previewUpload(file, onUploadProgress),
  });
}

export function useImportJobPolling(jobId: string | null, enabled = true) {
  return useQuery({
    queryKey: importKeys.job(jobId ?? ''),
    queryFn: () => importApi.getJobStatus(jobId!),
    enabled: Boolean(jobId) && enabled,
    refetchInterval: (query) => jobPollInterval(query.state.data?.status),
  });
}

export function useConfirmImportMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: (input: ImportConfirmInput) => importApi.confirmImport(input),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.statistics() });
      addToast({ type: 'success', message: 'Resume imported successfully' });
      router.push(`/edit/${data.resume.id}`);
    },
  });
}
