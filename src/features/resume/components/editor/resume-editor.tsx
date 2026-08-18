'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { FormProvider, useForm, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handleApiError } from '@/lib/api/error';
import type { PublicResume } from '@/types/resume';
import {
  emptyResumeSnapshot,
  normalizeResumeSnapshot,
  resumeSnapshotSchema,
  type ResumeSnapshot,
} from '@/features/resume/schemas/resume-snapshot-schema';
import { useAutoSaveResume } from '@/features/resume/hooks/use-auto-save-resume';
import { useResume } from '@/features/resume/hooks/use-resumes';
import { EditorLayout } from './editor-layout';
import { EditorSkeleton } from './editor-skeleton';
import { EditorToolbar } from './editor-toolbar';
import { VersionHistoryPanel } from './version-history-panel';

type ResumeEditorProps = {
  resumeId: string;
};

export function sanitizeForSave(values: ResumeSnapshot): ResumeSnapshot {
  return {
    ...values,
    summary: values.summary ?? '',
    skills: (values.skills ?? []).map((s) => s.trim()).filter(Boolean),
    experience: (values.experience ?? []).map((item) => ({
      ...item,
      highlights: (item.highlights ?? []).map((h) => h.trim()).filter(Boolean),
    })),
    projects: (values.projects ?? []).map((item) => ({
      ...item,
      highlights: (item.highlights ?? []).map((h) => h.trim()).filter(Boolean),
    })),
    languages: (values.languages ?? []).filter((l) => l.name?.trim()),
    socialLinks: (values.socialLinks ?? []).filter((l) => l.url?.trim()),
  };
}

export function ResumeEditor({ resumeId }: ResumeEditorProps) {
  const { data: resume, isLoading, isError, error, refetch } = useResume(resumeId);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [manualApiError, setManualApiError] = useState<string | null>(null);
  const loadedResumeIdRef = React.useRef<string | null>(null);

  const form = useForm<ResumeSnapshot>({
    resolver: zodResolver(resumeSnapshotSchema),
    defaultValues: emptyResumeSnapshot(),
    mode: 'onSubmit',
  });

  const { reset, handleSubmit, control, formState: { isDirty } } = form;

  const handleSaved = useCallback(
    (savedResume: PublicResume) => {
      reset(normalizeResumeSnapshot(savedResume.draft), { keepValues: true });
    },
    [reset]
  );

  const {
    seedLastSaved,
    flushSave,
    setApiError,
    setSaveStatus,
    saveStatus,
    lastSavedAt,
    apiError: autoSaveError,
    isSaving,
  } = useAutoSaveResume({
    resumeId,
    control,
    sanitizeForSave,
    isReady: Boolean(resume?.draft),
    enabled: Boolean(resume),
    onSaved: handleSaved,
  });

  useEffect(() => {
    if (!resume?.draft || loadedResumeIdRef.current === resume.id) return;
    const normalized = normalizeResumeSnapshot(resume.draft);
    reset(normalized);
    seedLastSaved(normalized, resume.lastSavedAt);
    loadedResumeIdRef.current = resume.id;
  }, [resume, reset, seedLastSaved]);

  const handleRestore = useCallback(
    (restoredResume: PublicResume) => {
      const normalized = normalizeResumeSnapshot(restoredResume.draft);
      reset(normalized);
      seedLastSaved(normalized, restoredResume.lastSavedAt);
      loadedResumeIdRef.current = restoredResume.id;
    },
    [reset, seedLastSaved]
  );

  const onManualSave = handleSubmit(async (values) => {
    setManualApiError(null);
    setApiError(null);
    setSaveStatus('saving');
    try {
      await flushSave(values);
      setSaveStatus('saved');
    } catch (err) {
      const parsed = handleApiError(err);
      setManualApiError(parsed.message);
      setSaveStatus('error');
      setApiError(parsed.message);

      parsed.errors.forEach((fieldError) => {
        const path = fieldError.path.split('.').filter(Boolean).join('.');
        if (path) {
          form.setError(path as FieldPath<ResumeSnapshot>, {
            message: fieldError.message,
          });
        }
      });
    }
  });

  const apiError = manualApiError ?? autoSaveError;

  if (isLoading) {
    return <EditorSkeleton />;
  }

  if (isError || !resume) {
    return (
      <Card className="max-w-lg mx-auto text-center">
        <CardHeader>
          <CardTitle>Resume not found</CardTitle>
          <CardDescription>
            {handleApiError(error).message || 'This resume could not be loaded.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <Loader2 className="h-4 w-4 mr-2" />
            Retry
          </Button>
          <Button asChild variant="default">
            <Link href="/resumes">Back to My Resumes</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <FormProvider {...form}>
      <div className="min-h-[calc(100vh-4rem)] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <EditorToolbar
          title={resume.title}
          isDirty={isDirty}
          saveStatus={saveStatus}
          apiError={apiError}
          onSave={() => void onManualSave()}
          isSaving={isSaving}
          lastSavedAt={lastSavedAt ?? resume.lastSavedAt}
          currentVersionNumber={resume.currentVersionNumber}
          onOpenVersionHistory={() => setHistoryOpen(true)}
        />
        <EditorLayout templateId={resume.templateId} />
      </div>

      <VersionHistoryPanel
        resumeId={resumeId}
        templateId={resume.templateId}
        currentVersionNumber={resume.currentVersionNumber}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onRestored={handleRestore}
      />
    </FormProvider>
  );
}
