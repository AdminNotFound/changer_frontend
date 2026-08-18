'use client';

import React from 'react';
import { DashboardShell } from './dashboard-shell';

interface ShellProps {
  children: React.ReactNode;
  title?: string;
}

export function Shell({ children, title }: ShellProps) {
  return <DashboardShell title={title}>{children}</DashboardShell>;
}
