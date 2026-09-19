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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-purple-700 focus:shadow-lg focus:ring-2 focus:ring-purple-500"
      >
        Skip to content
      </a>
      <AppSidebar />
      <div className="lg:pl-64">
        <AppHeader title={title} />
        <main id="main-content" className="p-4 sm:p-6 lg:p-8" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
