'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      const next = pathname && pathname !== '/' ? `?next=${encodeURIComponent(pathname)}` : '';
      router.replace(`/login${next}`);
    }
  }, [status, router, pathname]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9fc]">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-sm font-medium">Loading your session…</p>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9fc]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return <>{children}</>;
}
