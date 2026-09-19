import type { Metadata } from 'next';
import { ResumeListPage } from '@/features/resume/components/resume-list-page';

export const metadata: Metadata = {
  title: 'My Resumes | AI Job Maker',
  description: 'Create, import, and manage your ATS-optimized resumes.',
};

export default function ResumesPage() {
  return <ResumeListPage />;
}
