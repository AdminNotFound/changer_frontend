'use client';

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { RequireGuest } from '@/features/auth/components/require-guest';

function AuthLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 via-white to-purple-50/30 flex flex-col justify-center py-12">
      <Container className="w-full max-w-md">
        <RequireGuest>{children}</RequireGuest>
      </Container>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      }
    >
      <AuthLayoutInner>{children}</AuthLayoutInner>
    </Suspense>
  );
}
