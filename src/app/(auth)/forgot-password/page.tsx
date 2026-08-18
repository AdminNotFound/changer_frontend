import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const metadata = {
  title: 'Forgot Password | AI Job Maker',
  description: 'Request a password reset link for your AI Job Maker account.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
