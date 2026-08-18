'use client';

import { use } from 'react';
import { ResumeEditor } from '@/features/resume/components/editor/resume-editor';

export default function EditResumePage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = use(params);
  return <ResumeEditor resumeId={resumeId} />;
}
