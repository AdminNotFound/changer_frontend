import type { Metadata } from 'next';
import { Settings } from 'lucide-react';
import { ComingSoonPage } from '@/components/common/coming-soon-page';

export const metadata: Metadata = {
  title: 'Settings | AI Job Maker',
  description: 'Manage your account preferences and application settings.',
};

export default function SettingsPage() {
  return (
    <ComingSoonPage
      title="Settings"
      description="Manage your account preferences and application settings."
      icon={Settings}
    />
  );
}
