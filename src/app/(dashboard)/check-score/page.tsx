'use client';

import { Gauge } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';

export default function CheckScorePage() {
  return (
    <ComingSoonPage
      title="ATS Score"
      description="Paste a job description and see how your resume scores against it."
      icon={Gauge}
    />
  );
}
