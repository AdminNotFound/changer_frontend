'use client';

import { Mail } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';

export default function CoverLettersPage() {
  return (
    <ComingSoonPage
      title="Cover Letters"
      description="Generate and manage cover letters matched to your tailored resumes."
      icon={Mail}
    />
  );
}
