import type { Metadata } from 'next';
import { DashboardHomePage } from '@/features/dashboard/components/dashboard-home-page';

export const metadata: Metadata = {
  title: 'Dashboard | AI Job Maker',
  description: 'Overview of your resumes, ATS scores, tailored versions, and recent activity.',
};

export default function DashboardPage() {
  return <DashboardHomePage />;
}
