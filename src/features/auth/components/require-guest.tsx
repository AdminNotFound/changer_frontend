'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

const GUEST_ALLOWED_WHEN_AUTHENTICATED = ['/verify-email', '/reset-password'];

export function RequireGuest({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const allowAuthenticated = GUEST_ALLOWED_WHEN_AUTHENTICATED.some((path) =>
    pathname.startsWith(path)
  );

  React.useEffect(() => {
    if (status === 'authenticated' && !allowAuthenticated) {
      const next = searchParams.get('next');
      router.replace(next && next.startsWith('/') ? next : '/');
    }
  }, [status, allowAuthenticated, router, searchParams]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (status === 'authenticated' && !allowAuthenticated) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return <>{children}</>;
}
