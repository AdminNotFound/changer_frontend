'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '../api/auth-api';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { authKeys } from './auth-keys';
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResendVerificationRequest,
  ResetPasswordRequest,
} from '@/types/auth';
import type { User } from '@/types/auth';

function seedCurrentUser(queryClient: ReturnType<typeof useQueryClient>, user: User) {
  queryClient.setQueryData(authKeys.me(), user);
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setSession(data.accessToken);
      seedCurrentUser(queryClient, data.user);
      addToast({ type: 'success', message: 'Logged in successfully!' });
      const next = searchParams.get('next');
      router.push(next && next.startsWith('/') ? next : '/');
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearSession();
      queryClient.removeQueries({ queryKey: authKeys.all });
      addToast({ type: 'success', message: 'Logged out successfully.' });
      router.push('/login');
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
  });
}

export function useResetPasswordMutation() {
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      addToast({
        type: 'success',
        message: 'Password reset successful. You can sign in now.',
      });
      router.push('/login');
    },
  });
}

export function useResendVerificationMutation() {
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: (data: ResendVerificationRequest) =>
      authApi.resendVerification(data),
    onSuccess: () => {
      addToast({
        type: 'success',
        message: 'If an account exists, a verification email has been sent.',
      });
    },
  });
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
  });
}
