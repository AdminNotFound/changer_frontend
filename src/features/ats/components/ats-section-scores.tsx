'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { SectionScores } from '@/types/ats';

const SECTION_LABELS: Array<{ key: keyof SectionScores; label: string }> = [
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'projects', label: 'Projects' },
  { key: 'education', label: 'Education' },
  { key: 'tools', label: 'Tools' },
];

type AtsSectionScoresProps = {
  sectionScores: SectionScores;
};

export function AtsSectionScores({ sectionScores }: AtsSectionScoresProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Section scores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {SECTION_LABELS.map(({ key, label }) => {
          const value = sectionScores[key];
          return (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="tabular-nums text-gray-500">{value}</span>
              </div>
              <Progress value={value} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
