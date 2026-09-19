import type { Metadata } from 'next';
import { ImportResumePage } from '@/features/resume/components/import/import-resume-page';

export const metadata: Metadata = {
  title: 'Import Resume | AI Job Maker',
  description: 'Upload a PDF or DOCX resume and review the extracted information.',
};

export default function ResumeImportRoutePage() {
  return <ImportResumePage />;
}
