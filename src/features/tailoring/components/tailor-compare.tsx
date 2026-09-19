'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PreviewSections } from '@/features/resume/components/editor/preview/preview-sections';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';

type TailorCompareProps = {
  original: ResumeSnapshot;
  tailored: ResumeSnapshot;
  templateId: string;
  changedSections: string[];
};

export function TailorCompare({
  original,
  tailored,
  templateId,
  changedSections,
}: TailorCompareProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="overflow-hidden p-0">
        <CardHeader className="border-b border-gray-100 px-6 py-4">
          <CardTitle className="text-base">Original</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-5">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <PreviewSections snapshot={original} templateId={templateId} />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden p-0">
        <CardHeader className="border-b border-gray-100 px-6 py-4">
          <CardTitle className="text-base">Tailored</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-5">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <PreviewSections
              snapshot={tailored}
              templateId={templateId}
              highlightedSections={changedSections}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
