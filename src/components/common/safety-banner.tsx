import React from 'react';
import { ShieldCheck } from 'lucide-react';

type SafetyBannerProps = {
  description: string;
};

export function SafetyBanner({ description }: SafetyBannerProps) {
  return (
    <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <div>
        <p className="text-sm font-semibold text-amber-900">AI does not invent facts</p>
        <p className="mt-0.5 text-xs leading-relaxed text-amber-800">{description}</p>
      </div>
    </div>
  );
}
