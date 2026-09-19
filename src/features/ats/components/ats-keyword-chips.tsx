'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AtsKeywordChipsProps = {
  matchedKeywords: string[];
  missingKeywords: string[];
};

export function AtsKeywordChips({
  matchedKeywords,
  missingKeywords,
}: AtsKeywordChipsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Matched keywords
            <span className="ml-2 text-sm font-medium text-gray-400">
              {matchedKeywords.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {matchedKeywords.length === 0 ? (
            <p className="text-sm text-gray-500">No matching keywords yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {matchedKeywords.map((keyword, index) => (
                <Badge key={`matched-${index}-${keyword}`} variant="success">
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
  );
}
