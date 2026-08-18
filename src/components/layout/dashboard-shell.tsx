'use client';

import React from 'react';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';

type DashboardShellProps = {
  children: React.ReactNode;
  title?: string;
};

export function DashboardShell({ children, title }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#faf9fc]">
      <AppSidebar />
      <div className="lg:pl-64">
        <AppHeader title={title} />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
