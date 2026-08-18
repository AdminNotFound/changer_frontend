'use client';

import { Settings } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';

export default function SettingsPage() {
  return (
    <ComingSoonPage
      title="Settings"
      description="Manage your account preferences and application settings."
      icon={Settings}
    />
  );
}
