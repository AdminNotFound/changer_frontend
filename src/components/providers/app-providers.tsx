'use client';

import React from 'react';
import { ReactQueryProvider } from '@/components/providers/query-provider';
import { AuthProvider } from '@/features/auth/auth-provider';
import { ToastHost } from '@/components/common/toast-host';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        {children}
        <ToastHost />
      </AuthProvider>
    </ReactQueryProvider>
  );
}
