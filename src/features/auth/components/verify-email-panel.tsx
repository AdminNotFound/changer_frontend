'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, Mail, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handleApiError } from '@/lib/api/error';
import { authApi } from '../api/auth-api';
import {
  ResendVerificationFormData,
  resendVerificationSchema,
} from '../schemas/auth-schemas';
import { useResendVerificationMutation } from '../hooks/use-auth-mutations';

type VerifyState = 'loading' | 'success' | 'error' | 'missing';

export function VerifyEmailPanel() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const resendMutation = useResendVerificationMutation();
  const [state, setState] = useState<VerifyState>(token ? 'loading' : 'missing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const attempted = useRef(false);

  useEffect(() => {
    if (!token || attempted.current) return;
    attempted.current = true;

    const run = async () => {
      try {
        await authApi.verifyEmail(token);
        setState('success');
      } catch (err) {
        const apiErr = handleApiError(err);
        setErrorMessage(apiErr.message);
        setState('error');
      }
    };

    void run();
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationFormData>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: { email: '' },
  });

  const onResend = async (data: ResendVerificationFormData) => {
    setErrorMessage(null);
    try {
      await resendMutation.mutateAsync(data);
    } catch (err) {
      const apiErr = handleApiError(err);
      setErrorMessage(apiErr.message);
    }
  };

  if (state === 'loading') {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border-purple-100/50 bg-white/90 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-sm font-medium text-gray-600">Verifying your email…</p>
        </CardContent>
      </Card>
    );
  }

  if (state === 'success') {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border-purple-100/50 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
            Email verified
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Your email is verified. You can sign in to AI Job Maker now.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button variant="default" className="w-full">
              Continue to Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-purple-100/50 bg-white/90 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center pb-4">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <XCircle className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
          {state === 'missing' ? 'Verification link required' : 'Verification failed'}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {errorMessage ||
            'This verification link is invalid or has expired. Enter your email to request a new one.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onResend)} className="space-y-4">
          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-gray-700"
              htmlFor="verify-resend-email"
            >
              Email Address
            </label>
            <Input
              id="verify-resend-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register('email')}
              disabled={resendMutation.isPending}
            />
            {errors.email && (
              <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            variant="default"
            disabled={resendMutation.isPending}
          >
            {resendMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Resend verification email
          </Button>
        </form>
        <p className="text-center text-xs text-gray-500">
          <Link
            href="/login"
            className="font-semibold text-purple-600 hover:text-purple-700"
          >
            Back to Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
