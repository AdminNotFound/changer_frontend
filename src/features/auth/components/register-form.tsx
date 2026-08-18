'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, Mail, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handleApiError } from '@/lib/api/error';
import { RegisterFormData, registerSchema } from '../schemas/auth-schemas';
import {
  useRegisterMutation,
  useResendVerificationMutation,
} from '../hooks/use-auth-mutations';
import { PasswordInput } from './password-input';

export function RegisterForm() {
  const registerMutation = useRegisterMutation();
  const resendMutation = useResendVerificationMutation();
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const isLoading = registerMutation.isPending;

  const onSubmit = async (data: RegisterFormData) => {
    setApiErrorMessage(null);

    try {
      await registerMutation.mutateAsync(data);
      setRegisteredEmail(data.email);
    } catch (err) {
      const apiErr = handleApiError(err);
      setApiErrorMessage(apiErr.message);
    }
  };

  const handleResend = async () => {
    if (!registeredEmail) return;
    try {
      await resendMutation.mutateAsync({ email: registeredEmail });
    } catch (err) {
      const apiErr = handleApiError(err);
      setApiErrorMessage(apiErr.message);
    }
  };

  if (registeredEmail) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border-purple-100/50 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
            Check your email
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            We sent a verification link to{' '}
            <span className="font-semibold text-gray-700">{registeredEmail}</span>.
            Verify your email before signing in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiErrorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {apiErrorMessage}
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={resendMutation.isPending}
          >
            {resendMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Resend verification email
          </Button>
          <p className="text-center text-xs text-gray-500">
            Already verified?{' '}
            <Link
              href="/login"
              className="font-semibold text-purple-600 hover:text-purple-700"
            >
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-purple-100/50 bg-white/90 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
          Create an Account
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Start building ATS-optimized resumes in seconds
        </CardDescription>
      </CardHeader>
      <CardContent>
        {apiErrorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
            {apiErrorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700" htmlFor="register-name">
              Full Name
            </label>
            <Input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Rakhil VR"
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-xs text-red-600 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700" htmlFor="register-email">
              Email Address
            </label>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-gray-700"
              htmlFor="register-password"
            >
              Password
            </label>
            <PasswordInput
              id="register-password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-xs text-red-600 font-medium">
                {errors.password.message}
              </p>
            )}
            <p className="text-[11px] text-gray-400">At least 8 characters</p>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            variant="default"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )}
            Create Account
          </Button>

          <p className="text-center text-xs text-gray-500 pt-3">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-purple-600 hover:text-purple-700"
            >
              Sign In
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
