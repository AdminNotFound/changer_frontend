import React from 'react';
import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-100 text-purple-600 mb-4 shadow-sm">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        404 - Page Not Found
      </h2>
      <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="default" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Return to Home
        </Button>
      </Link>
    </div>
  );
}
