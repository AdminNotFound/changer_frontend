'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { VersionCompareParams } from '@/types/resume-version';
import { handleApiError } from '@/lib/api/error';
import { useUIStore } from '@/stores/ui-store';
import { versionApi } from '../api/version-api';
import { resumeKeys } from './resume-keys';

export function useVersionHistory(resumeId: string, enabled = true) {
  return useQuery({
    queryKey: resumeKeys.versions(resumeId),
    queryFn: () => versionApi.list(resumeId),
    enabled: Boolean(resumeId) && enabled,
  });
}

export function useVersion(resumeId: string, versionId: string, enabled = true) {
  return useQuery({
    queryKey: resumeKeys.version(resumeId, versionId),
    queryFn: () => versionApi.getById(resumeId, versionId),
    enabled: Boolean(resumeId) && Boolean(versionId) && enabled,
  });
}

export function useCompareVersions(
  resumeId: string,
  params: VersionCompareParams | null,
  enabled = true
) {
  return useQuery({
    queryKey: resumeKeys.compare(
      resumeId,
      params as Record<string, unknown>
    ),
    queryFn: () => versionApi.compare(resumeId, params!),
    enabled: Boolean(resumeId) && Boolean(params) && enabled,
  });
}

export function useRestoreVersionMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({
      resumeId,
      versionId,
    }: {
      resumeId: string;
      versionId: string;
    }) => versionApi.restore(resumeId, versionId),
    onSuccess: (data, { resumeId }) => {
      queryClient.setQueryData(resumeKeys.detail(resumeId), data.resume);
      void queryClient.invalidateQueries({ queryKey: resumeKeys.versions(resumeId) });
      void queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      const versionNum = data.version?.versionNumber;
      const message = data.created
        ? `Version restored and saved as v${versionNum ?? 'new'}`
        : 'Version restored to draft';
      addToast({ type: 'success', message });
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      addToast({
        type: 'error',
        message: apiError.message || 'Failed to restore version',
      });
    },
  });
}

export function useDeleteVersionMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({
      resumeId,
      versionId,
    }: {
      resumeId: string;
      versionId: string;
    }) => versionApi.delete(resumeId, versionId),
    onSuccess: (_data, { resumeId }) => {
      void queryClient.invalidateQueries({ queryKey: resumeKeys.versions(resumeId) });
      void queryClient.invalidateQueries({ queryKey: resumeKeys.detail(resumeId) });
      addToast({ type: 'success', message: 'Version deleted' });
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      addToast({
        type: 'error',
        message: apiError.message || 'Failed to delete version',
      });
    },
  });
}
