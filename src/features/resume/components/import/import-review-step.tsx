'use client';

import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { handleApiError } from '@/lib/api/error';
import {
  normalizeResumeSnapshot,
  resumeSnapshotSchema,
  type ResumeSnapshot,
} from '@/features/resume/schemas/resume-snapshot-schema';
import type { ImportPreviewMeta } from '@/types/resume-import';
import { sanitizeForSave } from '@/features/resume/utils/sanitize-resume-snapshot';
import { useConfirmImportMutation } from '@/features/resume/hooks/use-resume-import';
import { EditorFormSections } from '../editor/editor-form-sections';
import { ResumePreview } from '../editor/preview/resume-preview';

type ImportReviewStepProps = {
  extracted: ResumeSnapshot;
  meta: ImportPreviewMeta;
  onBack: () => void;
};

export function ImportReviewStep({ extracted, meta, onBack }: ImportReviewStepProps) {
  const confirmMutation = useConfirmImportMutation();
  const [title, setTitle] = useState(
    extracted.personalInfo?.fullName?.trim() ||
      meta.fileName.replace(/\.(pdf|docx)$/i, '') ||
      ''
  );
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<ResumeSnapshot>({
    resolver: zodResolver(resumeSnapshotSchema),
    defaultValues: normalizeResumeSnapshot(extracted),
    mode: 'onSubmit',
  });

  const { handleSubmit } = form;

  const onConfirm = handleSubmit(async (values) => {
    setApiError(null);
    try {
      const content = sanitizeForSave(values);
      const trimmedTitle = title.trim();
      await confirmMutation.mutateAsync({
        content,
        ...(trimmedTitle ? { title: trimmedTitle } : {}),
      });
    } catch (err) {
      setApiError(handleApiError(err).message);
    }
  });

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Review imported data
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              Review and edit extracted data before saving. Importing creates a{' '}
              <strong className="font-semibold text-gray-700">new</strong> resume
              and does not overwrite existing ones.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary">{meta.format.toUpperCase()}</Badge>
              <Badge variant="outline">{meta.fileName}</Badge>
              <Badge variant="outline">{meta.characterCount.toLocaleString()} chars extracted</Badge>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Start over
          </Button>
        </div>

        <div className="max-w-md space-y-1.5">
          <label htmlFor="import-title" className="text-xs font-semibold text-gray-700">
            Resume title
          </label>
          <Input
            id="import-title"
            placeholder="Imported Resume"
            value={title}
            disabled={confirmMutation.isPending}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="text-[11px] text-gray-400">
            Optional. Defaults to your name or &quot;Imported Resume&quot;.
          </p>
        </div>

        {apiError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        ) : null}

        <div className="lg:hidden">
          <Tabs defaultValue="edit">
            <TabsList>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <EditorFormSections />
            </TabsContent>
            <TabsContent value="preview">
              <ResumePreview templateId="modern" />
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 xl:gap-8">
          <div className="overflow-y-auto max-h-[calc(100vh-16rem)] pr-2">
            <EditorFormSections />
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-16rem)] pl-2 sticky top-20">
            <ResumePreview templateId="modern" />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            disabled={confirmMutation.isPending}
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            type="button"
            disabled={confirmMutation.isPending}
            onClick={() => void onConfirm()}
          >
            {confirmMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            ) : null}
            Confirm import
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
