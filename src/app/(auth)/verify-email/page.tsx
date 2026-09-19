import type { Metadata } from 'next';
import { VerifyEmailPanel } from '@/features/auth/components/verify-email-panel';

export const metadata: Metadata = {
  title: 'Verify Email | AI Job Maker',
  description: 'Verify your email address to finish setting up your AI Job Maker account.',
};

export default function VerifyEmailPage() {
  return <VerifyEmailPanel />;
}
