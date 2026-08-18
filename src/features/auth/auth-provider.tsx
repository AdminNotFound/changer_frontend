'use client';

import React, { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from './api/auth-api';
import { authKeys } from './hooks/auth-keys';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setStatus = useAuthStore((s) => s.setStatus);
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const bootstrap = async () => {
      setStatus('loading');
      try {
        const data = await authApi.refresh();
        setSession(data.accessToken);
        queryClient.setQueryData(authKeys.me(), data.user);
      } catch {
        clearSession();
      }
    };

    void bootstrap();
  }, [clearSession, queryClient, setSession, setStatus]);

  return <>{children}</>;
}
