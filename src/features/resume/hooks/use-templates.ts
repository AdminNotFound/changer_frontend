'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '@/stores/ui-store';
import { handleApiError } from '@/lib/api/error';
import type { ChangeTemplateInput } from '@/types/resume-template';
import { templateApi } from '../api/template-api';
import { resumeKeys, templateKeys } from './resume-keys';

export function useTemplates() {
  return useQuery({
    queryKey: templateKeys.list(),
    queryFn: () => templateApi.listTemplates(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useChangeTemplateMutation(resumeId: string) {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: (input: ChangeTemplateInput) =>
      templateApi.changeTemplate(resumeId, input),
    onSuccess: (resume) => {
      queryClient.setQueryData(resumeKeys.detail(resumeId), resume);
      addToast({ type: 'success', message: 'Template updated' });
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      addToast({
        type: 'error',
        message: apiError.message || 'Failed to update template',
      });
    },
  });
}
