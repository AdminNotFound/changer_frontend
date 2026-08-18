'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { ImportConfirmInput, ImportJobStatus } from '@/types/resume-import';
import { useUIStore } from '@/stores/ui-store';
import { importApi } from '../api/import-api';
import { importKeys } from './resume-keys';
import { resumeKeys } from './resume-keys';

const POLLING_STATUSES: ImportJobStatus[] = [
  'queued',
  'waiting',
  'active',
  'delayed',
];

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
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status) return 1500;
      return POLLING_STATUSES.includes(status) ? 1500 : false;
    },
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
      addToast({ type: 'success', message: 'Resume imported successfully' });
      router.push(`/edit/${data.resume.id}`);
    },
  });
}
