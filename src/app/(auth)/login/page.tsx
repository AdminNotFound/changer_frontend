import { LoginForm } from '@/features/auth/components/login-form';

export const metadata = {
  title: 'Sign In | AI Job Maker',
  description: 'Sign in to your AI Job Maker account to build and manage your ATS resumes.',
};

export default function LoginPage() {
  return <LoginForm />;
}
