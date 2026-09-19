import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password | AI Job Maker',
  description: 'Choose a new password for your AI Job Maker account.',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
