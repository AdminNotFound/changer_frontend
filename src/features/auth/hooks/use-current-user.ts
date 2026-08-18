'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '../api/auth-api';
import { authKeys } from './auth-keys';

export function useCurrentUser() {
  const status = useAuthStore((s) => s.status);
  const isAuthenticated = status === 'authenticated';

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}
