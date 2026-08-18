'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2, KeyRound, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handleApiError } from '@/lib/api/error';
import { ForgotPasswordFormData, forgotPasswordSchema } from '../schemas/auth-schemas';
import { useForgotPasswordMutation } from '../hooks/use-auth-mutations';

export function ForgotPasswordForm() {
  const forgotMutation = useForgotPasswordMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const isLoading = forgotMutation.isPending;

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setApiErrorMessage(null);

    try {
      await forgotMutation.mutateAsync(data);
      setIsSubmitted(true);
    } catch (err) {
      const apiErr = handleApiError(err);
      setApiErrorMessage(apiErr.message);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-purple-100/50 bg-white/90 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
          Reset Password
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {isSubmitted
            ? "If an account exists, we've sent a password reset link to your email."
            : 'Enter your account email to receive a password reset link.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {apiErrorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
            {apiErrorMessage}
          </div>
        )}

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold text-gray-700"
                htmlFor="forgot-email"
              >
                Email Address
              </label>
              <Input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.email.message}
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
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-sm text-gray-600">
              Please check your inbox and follow the instructions to reset your
              password.
            </p>
          </div>
        )}

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
