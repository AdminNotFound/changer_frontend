import type { Metadata } from 'next';
import { TailorResumePage } from '@/features/tailoring/components/tailor-resume-page';

export const metadata: Metadata = {
  title: 'Tailor Resume | AI Job Maker',
  description: 'Tailor your resume to a job description while keeping your facts intact.',
};

export default function TailorPage() {
  return <TailorResumePage />;
}
