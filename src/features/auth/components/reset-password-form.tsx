'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, KeyRound, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handleApiError } from '@/lib/api/error';
import { ResetPasswordFormData, resetPasswordSchema } from '../schemas/auth-schemas';
import { useResetPasswordMutation } from '../hooks/use-auth-mutations';
import { PasswordInput } from './password-input';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const resetMutation = useResetPasswordMutation();
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const isLoading = resetMutation.isPending;

  if (!token) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border-purple-100/50 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
            Invalid reset link
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            This password reset link is missing a token. Request a new one from
            the forgot password page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <Link href="/forgot-password">
            <Button variant="default" className="w-full">
              Request new link
            </Button>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center text-xs font-semibold text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Sign In
          </Link>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setApiErrorMessage(null);
    try {
      await resetMutation.mutateAsync({
        token,
        password: data.password,
      });
    } catch (err) {
      const apiErr = handleApiError(err);
      setApiErrorMessage(apiErr.message);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-purple-100/50 bg-white/90 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
          Set a new password
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Choose a strong password for your AI Job Maker account.
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
            <label
              className="text-xs font-semibold text-gray-700"
              htmlFor="reset-password"
            >
              New Password
            </label>
            <PasswordInput
              id="reset-password"
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
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-gray-700"
              htmlFor="reset-confirm"
            >
              Confirm Password
            </label>
            <PasswordInput
              id="reset-confirm"
              autoComplete="new-password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 font-medium">
                {errors.confirmPassword.message}
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
              <KeyRound className="h-4 w-4 mr-2" />
            )}
            Update Password
          </Button>
        </form>

        <div className="pt-4 text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-xs font-semibold text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
