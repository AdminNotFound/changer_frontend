'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SECTION_LABELS: Record<string, string> = {
  summary: 'Summary',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
  certifications: 'Certifications',
};

type TailorChangesProps = {
  changedSections: string[];
  addedKeywords: string[];
  missingKeywords: string[];
};

export function TailorChanges({
  changedSections,
  addedKeywords,
  missingKeywords,
}: TailorChangesProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Changed sections
            <span className="ml-2 text-sm font-medium text-gray-400">
              {changedSections.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {changedSections.length === 0 ? (
            <p className="text-sm text-gray-500">No sections were changed.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {changedSections.map((section) => (
                <Badge key={section} variant="default">
                  {SECTION_LABELS[section] ?? section}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Added keywords
              <span className="ml-2 text-sm font-medium text-gray-400">
                {addedKeywords.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {addedKeywords.length === 0 ? (
              <p className="text-sm text-gray-500">No new keywords were added.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {addedKeywords.map((keyword, index) => (
                  <Badge key={`added-${index}-${keyword}`} variant="success">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Missing keywords
              <span className="ml-2 text-sm font-medium text-gray-400">
                {missingKeywords.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {missingKeywords.length === 0 ? (
              <p className="text-sm text-gray-500">No missing keywords.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((keyword, index) => (
                  <Badge key={`missing-${index}-${keyword}`} variant="destructive">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
