'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AtsScoreResult, SectionScores } from '@/types/ats';

const SECTION_LABELS: Array<{ key: keyof SectionScores; label: string }> = [
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'projects', label: 'Projects' },
  { key: 'education', label: 'Education' },
  { key: 'tools', label: 'Tools' },
];

type AtsScoreBreakdownProps = {
  result: AtsScoreResult;
};

export function AtsScoreBreakdown({ result }: AtsScoreBreakdownProps) {
  const { scoreBreakdown, keywordDensity } = result;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Score breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Keyword density</span>
            <span className="tabular-nums text-gray-500">{keywordDensity}%</span>
          </div>
          <Progress value={keywordDensity} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Matched" value={scoreBreakdown.matchedCount} />
          <Stat label="Missing" value={scoreBreakdown.missingCount} />
          <Stat label="Total keywords" value={scoreBreakdown.totalKeywords} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-gray-400">
                <th className="pb-2 font-medium">Section</th>
                <th className="pb-2 font-medium">Weight</th>
                <th className="pb-2 font-medium">Weighted</th>
              </tr>
            </thead>
            <tbody>
              {SECTION_LABELS.map(({ key, label }) => (
                <tr key={key} className="border-t border-gray-100">
                  <td className="py-2 text-gray-700">{label}</td>
                  <td className="py-2 tabular-nums text-gray-500">
                    {Math.round(scoreBreakdown.weights[key] * 100)}%
                  </td>
                  <td className="py-2 tabular-nums text-gray-500">
                    {scoreBreakdown.weightedScores[key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-center">
      <p className="text-lg font-bold tabular-nums text-gray-900">{value}</p>
      <p className="text-[11px] font-medium text-gray-500">{label}</p>
    </div>
  );
}
