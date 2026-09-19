import type { Metadata } from 'next';
import { CoverLettersPage } from '@/features/cover-letters/components/cover-letters-page';

export const metadata: Metadata = {
  title: 'Cover Letters | AI Job Maker',
  description: 'Generate and edit cover letters tailored to a job description.',
};

export default function CoverLettersRoutePage() {
  return <CoverLettersPage />;
}
