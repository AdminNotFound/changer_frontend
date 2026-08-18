'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function SectionCard({
  title,
  description,
  children,
  defaultOpen = true,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-gray-50/80 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          {description ? (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          ) : null}
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-gray-400 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>
      {open ? <div className="px-4 pb-4 space-y-4 border-t border-gray-50 pt-4">{children}</div> : null}
    </section>
  );
}
