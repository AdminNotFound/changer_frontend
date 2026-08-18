'use client';

import { Sparkles } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';

export default function TailorPage() {
  return (
    <ComingSoonPage
      title="Tailor Resume"
      description="Optimize your resume for a specific job description with ATS keyword matching."
      icon={Sparkles}
    />
  );
}
