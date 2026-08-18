'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useWatch, type Control } from 'react-hook-form';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import { handleApiError } from '@/lib/api/error';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { PublicResume } from '@/types/resume';
import type { SaveStatus } from '../components/editor/editor-toolbar';
import { useSaveResumeMutation } from './use-save-resume-mutation';

function serializeSnapshot(snapshot: ResumeSnapshot): string {
  return JSON.stringify(snapshot);
}

type UseAutoSaveResumeOptions = {
  resumeId: string;
  control: Control<ResumeSnapshot>;
  sanitizeForSave: (values: ResumeSnapshot) => ResumeSnapshot;
  isReady: boolean;
  enabled?: boolean;
  debounceMs?: number;
  onSaved?: (resume: PublicResume) => void;
};

export function useAutoSaveResume({
  resumeId,
  control,
  sanitizeForSave,
  isReady,
  enabled = true,
  debounceMs = 800,
  onSaved,
}: UseAutoSaveResumeOptions) {
  const watchedValues = useWatch({ control }) as ResumeSnapshot;
  const debouncedValues = useDebouncedValue(watchedValues, debounceMs);
  const saveMutation = useSaveResumeMutation();

  const lastSavedRef = useRef<string>('');
  const isInitializedRef = useRef(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const seedLastSaved = useCallback(
    (snapshot: ResumeSnapshot, savedAt?: string | null) => {
      const sanitized = sanitizeForSave(snapshot);
      lastSavedRef.current = serializeSnapshot(sanitized);
      isInitializedRef.current = true;
      if (savedAt) setLastSavedAt(savedAt);
    },
    [sanitizeForSave]
  );

  const performSave = useCallback(
    async (values: ResumeSnapshot, silent = true) => {
      const content = sanitizeForSave(values);
      const serialized = serializeSnapshot(content);

      if (serialized === lastSavedRef.current) {
        return { changed: false };
      }

      setSaveStatus('saving');
      setApiError(null);

      try {
        const result = await saveMutation.mutateAsync({
          resumeId,
          content,
          silent,
        });
        lastSavedRef.current = serializeSnapshot(
          sanitizeForSave(result.resume.draft as ResumeSnapshot)
        );
        const savedAt = result.resume.lastSavedAt ?? new Date().toISOString();
        setLastSavedAt(savedAt);
        setSaveStatus('saved');
        onSaved?.(result.resume);
        return { changed: result.changed, lastSavedAt: savedAt, resume: result.resume };
      } catch (err) {
        setSaveStatus('error');
        setApiError(handleApiError(err).message);
        if (!silent) throw err;
        return null;
      }
    },
    [resumeId, sanitizeForSave, saveMutation, onSaved]
  );

  const flushSave = useCallback(
    async (values: ResumeSnapshot) => performSave(values, false),
    [performSave]
  );

  useEffect(() => {
    if (saveStatus !== 'saved') return;
    const timer = window.setTimeout(() => setSaveStatus('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [saveStatus]);

  useEffect(() => {
    if (!isReady || !enabled || !isInitializedRef.current) return;

    const serialized = serializeSnapshot(sanitizeForSave(debouncedValues));
    if (serialized === lastSavedRef.current) return;

    void performSave(debouncedValues, true);
  }, [debouncedValues, isReady, enabled, sanitizeForSave, performSave]);

  return {
    saveStatus,
    setSaveStatus,
    lastSavedAt,
    setLastSavedAt,
    apiError,
    setApiError,
    seedLastSaved,
    flushSave,
    isSaving: saveMutation.isPending,
  };
}
