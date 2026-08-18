'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { resumeApi } from '../api/resume-api';
import { resumeKeys } from './resume-keys';
import { useUIStore } from '@/stores/ui-store';
import type { CreateResumeInput, MyResumesQuery } from '@/types/resume';

export function useMyResumes(query: MyResumesQuery) {
  return useQuery({
    queryKey: resumeKeys.list(query as Record<string, unknown>),
    queryFn: () => resumeApi.listMyResumes(query),
    placeholderData: (previous) => previous,
  });
}

export function useResume(resumeId: string, enabled = true) {
  return useQuery({
    queryKey: resumeKeys.detail(resumeId),
    queryFn: () => resumeApi.getById(resumeId),
    enabled: Boolean(resumeId) && enabled,
  });
}

export function useCreateResumeMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: (input: CreateResumeInput) => resumeApi.create(input),
    onSuccess: (resume) => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      addToast({ type: 'success', message: 'Resume created successfully' });
      router.push(`/edit/${resume.id}`);
    },
  });
}
