'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function CoverLetterSafetyBanner() {
  return (
    <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <div>
        <p className="text-sm font-semibold text-amber-900">AI does not invent facts</p>
        <p className="mt-0.5 text-xs leading-relaxed text-amber-800">
          Cover letters only use experience already on your resume. Review the draft before you send
          it.
        </p>
      </div>
    </div>
  );
}
