'use client';

import React from 'react';
import { Shell } from '@/components/layout/shell';
import { RequireAuth } from '@/features/auth/components/require-auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <Shell>{children}</Shell>
    </RequireAuth>
  );
}
