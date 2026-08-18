'use client';

import React, { useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmRemoveDialog } from '../shared/confirm-remove-dialog';
import { FieldRow } from '../shared/field-row';
import { HighlightsList } from '../shared/highlights-list';
import { SectionCard } from '../shared/section-card';
import { SortableItem, SortableList } from '../shared/sortable-list';

const emptyProject = {
  name: '',
  description: '',
  url: '',
  highlights: [] as string[],
};

export function ProjectsSection() {
  const { control, register } = useFormContext<ResumeSnapshot>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'projects',
  });
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const ids = fields.map((field) => field.id);

  return (
    <SectionCard title="Projects" description="Notable projects and side work">
      {fields.length === 0 ? (
        <p className="text-xs text-gray-500">No projects yet.</p>
      ) : (
        <SortableList ids={ids} onReorder={move}>
          {fields.map((field, index) => (
            <SortableItem key={field.id} id={field.id}>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-gray-700">Project {index + 1}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="px-2.5"
                    onClick={() => setRemoveIndex(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FieldRow label="Project name">
                    <Input placeholder="Portfolio App" {...register(`projects.${index}.name`)} />
                  </FieldRow>
                  <FieldRow label="URL">
                    <Input placeholder="https://github.com/..." {...register(`projects.${index}.url`)} />
                  </FieldRow>
                </div>
                <FieldRow label="Description">
                  <Textarea
                    className="min-h-[80px]"
                    placeholder="What you built and why it matters..."
                    {...register(`projects.${index}.description`)}
                  />
                </FieldRow>
                <Controller
                  control={control}
                  name={`projects.${index}.highlights`}
                  render={({ field: highlightsField }) => (
                    <HighlightsList
                      values={highlightsField.value ?? []}
                      onChange={highlightsField.onChange}
                    />
                  )}
                />
              </div>
            </SortableItem>
          ))}
        </SortableList>
      )}

      <Button type="button" variant="outline" size="sm" onClick={() => append(emptyProject)}>
        <Plus className="h-4 w-4 mr-1.5" />
        Add project
      </Button>

      <ConfirmRemoveDialog
        open={removeIndex !== null}
        title="Remove project?"
        onCancel={() => setRemoveIndex(null)}
        onConfirm={() => {
          if (removeIndex !== null) remove(removeIndex);
          setRemoveIndex(null);
        }}
      />
    </SectionCard>
  );
}
