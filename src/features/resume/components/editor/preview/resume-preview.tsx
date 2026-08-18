'use client';

import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import { PreviewSections } from './preview-sections';

type ResumePreviewProps = {
  templateId: string;
};

export function ResumePreview({ templateId }: ResumePreviewProps) {
  const { control } = useFormContext<ResumeSnapshot>();
  const snapshot = useWatch({ control }) as ResumeSnapshot;

  const hasContent =
    snapshot?.personalInfo?.fullName?.trim() ||
    snapshot?.summary?.trim() ||
    (snapshot?.skills ?? []).some(Boolean) ||
    (snapshot?.experience ?? []).length > 0 ||
    (snapshot?.education ?? []).length > 0 ||
    (snapshot?.projects ?? []).length > 0 ||
    (snapshot?.certifications ?? []).length > 0 ||
    (snapshot?.languages ?? []).some((l) => l.name?.trim()) ||
    (snapshot?.socialLinks ?? []).some((l) => l.url?.trim());

  return (
    <div className="sticky top-20">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">Live preview</h2>
        <span className="text-[11px] text-gray-400 capitalize">{templateId} template</span>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="aspect-[8.5/11] overflow-y-auto p-6 sm:p-8">
          {hasContent ? (
            <PreviewSections snapshot={snapshot} templateId={templateId} />
          ) : (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center text-gray-400">
              <p className="text-sm font-medium">Your resume preview</p>
              <p className="mt-1 max-w-[200px] text-xs">
                Start filling in sections to see your resume come to life.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
