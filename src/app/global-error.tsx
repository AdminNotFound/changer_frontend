'use client';

import { RouteErrorFallback } from '@/components/common/route-error-fallback';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="h-full antialiased font-sans bg-[#faf9fc]">
        <RouteErrorFallback error={error} reset={reset} />
      </body>
    </html>
  );
}
