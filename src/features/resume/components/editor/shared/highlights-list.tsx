'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type HighlightsListProps = {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export function HighlightsList({
  values,
  onChange,
  placeholder = 'Achievement or responsibility',
}: HighlightsListProps) {
  const items = values.length > 0 ? values : [''];

  const updateItem = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const addItem = () => onChange([...items, '']);

  const removeItem = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    onChange(next.length > 0 ? next : ['']);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-700">Highlights</p>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={item}
            placeholder={placeholder}
            onChange={(e) => updateItem(index, e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 px-2.5"
            onClick={() => removeItem(index)}
            aria-label="Remove highlight"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="h-4 w-4 mr-1.5" />
        Add highlight
      </Button>
    </div>
  );
}
