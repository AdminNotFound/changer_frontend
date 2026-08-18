'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handleApiError } from '@/lib/api/error';
import { LoginFormData, loginSchema } from '../schemas/auth-schemas';
import {
  useLoginMutation,
  useResendVerificationMutation,
} from '../hooks/use-auth-mutations';
import { PasswordInput } from './password-input';

export function LoginForm() {
  const loginMutation = useLoginMutation();
  const resendMutation = useResendVerificationMutation();
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isLoading = loginMutation.isPending;

  const onSubmit = async (data: LoginFormData) => {
    setApiErrorMessage(null);
    setNeedsVerification(false);

    try {
      await loginMutation.mutateAsync(data);
    } catch (err) {
      const apiErr = handleApiError(err);
      setApiErrorMessage(apiErr.message);
      if (apiErr.statusCode === 403) {
        setNeedsVerification(true);
        setPendingEmail(data.email);
      }
    }
  };

  const handleResend = async () => {
    const email = pendingEmail || getValues('email');
    if (!email) return;
    try {
      await resendMutation.mutateAsync({ email });
    } catch (err) {
      const apiErr = handleApiError(err);
      setApiErrorMessage(apiErr.message);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-purple-100/50 bg-white/90 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
          Welcome back
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Enter your credentials to sign in to your AI Job Maker account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {apiErrorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 space-y-2">
            <p>{apiErrorMessage}</p>
            {needsVerification && (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendMutation.isPending}
                className="text-purple-700 font-semibold underline underline-offset-2 disabled:opacity-50"
              >
                {resendMutation.isPending
                  ? 'Sending…'
                  : 'Resend verification email'}
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700" htmlFor="login-email">
              Email Address
            </label>
            <Input
              id="login-email"
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
            <div className="flex items-center justify-between">
              <label
                className="text-xs font-semibold text-gray-700"
                htmlFor="login-password"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-purple-600 hover:text-purple-700"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="login-password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-xs text-red-600 font-medium">
                {errors.password.message}
              </p>
            )}
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
              <LogIn className="h-4 w-4 mr-2" />
            )}
            Sign In
          </Button>

          <p className="text-center text-xs text-gray-500 pt-3">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-purple-600 hover:text-purple-700"
            >
              Create one now
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
