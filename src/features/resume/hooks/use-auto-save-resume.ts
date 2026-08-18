'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { UseFormGetValues, UseFormWatch } from 'react-hook-form';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import { handleApiError } from '@/lib/api/error';
import type { SaveStatus } from '../components/editor/editor-toolbar';
import { useSaveResumeMutation } from './use-save-resume-mutation';

function serializeSnapshot(snapshot: ResumeSnapshot): string {
  return JSON.stringify(snapshot);
}

type UseAutoSaveResumeOptions = {
  resumeId: string;
  watch: UseFormWatch<ResumeSnapshot>;
  getValues: UseFormGetValues<ResumeSnapshot>;
  sanitizeForSave: (values: ResumeSnapshot) => ResumeSnapshot;
  isReady: boolean;
  enabled?: boolean;
  debounceMs?: number;
};

export function useAutoSaveResume({
  resumeId,
  watch,
  getValues,
  sanitizeForSave,
  isReady,
  enabled = true,
  debounceMs = 800,
}: UseAutoSaveResumeOptions) {
  const { mutateAsync, isPending } = useSaveResumeMutation();

  const lastSavedRef = useRef<string>('');
  const isInitializedRef = useRef(false);
  const inFlightRef = useRef(false);
  const mutateAsyncRef = useRef(mutateAsync);
  const sanitizeRef = useRef(sanitizeForSave);
  const getValuesRef = useRef(getValues);

  mutateAsyncRef.current = mutateAsync;
  sanitizeRef.current = sanitizeForSave;
  getValuesRef.current = getValues;

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState(true);

  const hashValues = useCallback((values: ResumeSnapshot) => {
    return serializeSnapshot(sanitizeRef.current(values));
  }, []);

  const seedLastSaved = useCallback((snapshot: ResumeSnapshot, savedAt?: string | null) => {
    lastSavedRef.current = hashValues(snapshot);
    isInitializedRef.current = true;
    setIsSynced(true);
    if (savedAt) setLastSavedAt(savedAt);
  }, [hashValues]);

  const performSave = useCallback(
    async (values: ResumeSnapshot, silent = true) => {
      const content = sanitizeRef.current(values);
      const serialized = serializeSnapshot(content);

      if (serialized === lastSavedRef.current) {
        setIsSynced(true);
        return { changed: false };
      }

      if (inFlightRef.current) {
        return { changed: false };
      }

      inFlightRef.current = true;
      const previousSaved = lastSavedRef.current;
      lastSavedRef.current = serialized;
      setIsSynced(true);
      setSaveStatus('saving');
      setApiError(null);

      try {
        const result = await mutateAsyncRef.current({
          resumeId,
          content,
          silent,
        });
        const savedAt = result.resume.lastSavedAt ?? new Date().toISOString();
        setLastSavedAt(savedAt);
        setSaveStatus('saved');
        return { changed: result.changed, lastSavedAt: savedAt, resume: result.resume };
      } catch (err) {
        lastSavedRef.current = previousSaved;
        setIsSynced(false);
        setSaveStatus('error');
        setApiError(handleApiError(err).message);
        if (!silent) throw err;
        return null;
      } finally {
        inFlightRef.current = false;
      }
    },
    [resumeId]
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
    if (!isReady || !enabled) return;

    let timer: number | undefined;

    const scheduleSave = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!isInitializedRef.current) return;
        if (inFlightRef.current) {
          scheduleSave();
          return;
        }
        void performSave(getValuesRef.current(), true);
      }, debounceMs);
    };

    const subscription = watch((values) => {
      if (!isInitializedRef.current) return;
      const serialized = hashValues(values as ResumeSnapshot);
      setIsSynced(serialized === lastSavedRef.current);
      if (serialized === lastSavedRef.current) {
        window.clearTimeout(timer);
        return;
      }
      scheduleSave();
    });

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timer);
    };
  }, [watch, isReady, enabled, debounceMs, performSave, hashValues]);

  return {
    saveStatus,
    setSaveStatus,
    lastSavedAt,
    setLastSavedAt,
    apiError,
    setApiError,
    seedLastSaved,
    flushSave,
    isSaving: isPending,
    hasUnsavedChanges: !isSynced,
  };
}
