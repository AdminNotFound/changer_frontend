import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata = {
  title: 'Register | AI Job Maker',
  description: 'Create an account on AI Job Maker to build ATS-optimized resumes.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
