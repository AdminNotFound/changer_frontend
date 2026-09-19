import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { RequireAuth } from '@/features/auth/components/require-auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <DashboardShell>{children}</DashboardShell>
    </RequireAuth>
  );
}
