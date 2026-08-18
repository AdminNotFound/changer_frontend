'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import { handleApiError } from '@/lib/api/error';
import { useUIStore } from '@/stores/ui-store';
import { resumeApi } from '../api/resume-api';
import { resumeKeys } from './resume-keys';

export type SaveResumeInput = {
  resumeId: string;
  content: ResumeSnapshot;
  silent?: boolean;
};

export function useSaveResumeMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ resumeId, content }: SaveResumeInput) =>
      resumeApi.autoSave(resumeId, content),
    onSuccess: (data, { resumeId, silent }) => {
      queryClient.setQueryData(resumeKeys.detail(resumeId), data.resume);
      void queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      if (data.changed && !silent) {
        addToast({ type: 'success', message: 'Resume saved successfully' });
      }
    },
    onError: (error, { silent }) => {
      if (silent) return;
      const apiError = handleApiError(error);
      addToast({
        type: 'error',
        message: apiError.message || 'Failed to save resume',
      });
    },
  });
}
