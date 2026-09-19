import type { Metadata } from 'next';
import { AtsScorePage } from '@/features/ats/components/ats-score-page';

export const metadata: Metadata = {
  title: 'ATS Score | AI Job Maker',
  description: 'Check how well your resume matches a job description.',
};

export default function AtsPage() {
  return <AtsScorePage />;
}
