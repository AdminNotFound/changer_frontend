import type { Metadata } from 'next';
import { ResumeEditor } from '@/features/resume/components/editor/resume-editor';

export const metadata: Metadata = {
  title: 'Edit Resume | AI Job Maker',
  description: 'Edit your resume, preview templates, and export a PDF.',
};

export default async function EditResumePage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await params;
  return <ResumeEditor resumeId={resumeId} />;
}
