'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AtsSuggestionsListProps = {
  suggestions: string[];
};

export function AtsSuggestionsList({ suggestions }: AtsSuggestionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <p className="text-sm text-gray-500">No suggestions for this analysis.</p>
        ) : (
          <ol className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <li
                key={`${index}-${suggestion.slice(0, 24)}`}
                className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{suggestion}</p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
