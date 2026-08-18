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

const emptyExperience = {
  company: '',
  title: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  highlights: [] as string[],
};

export function ExperienceSection() {
  const { control, register, setValue, watch } = useFormContext<ResumeSnapshot>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'experience',
  });
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const ids = fields.map((field) => field.id);

  return (
    <SectionCard title="Experience" description="Work history with highlights">
      {fields.length === 0 ? (
        <p className="text-xs text-gray-500">No experience entries yet.</p>
      ) : (
        <SortableList ids={ids} onReorder={move}>
          {fields.map((field, index) => {
            const isCurrent = watch(`experience.${index}.current`);
            return (
              <SortableItem key={field.id} id={field.id}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-gray-700">Role {index + 1}</p>
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
                    <FieldRow label="Job title">
                      <Input placeholder="Software Engineer" {...register(`experience.${index}.title`)} />
                    </FieldRow>
                    <FieldRow label="Company">
                      <Input placeholder="Acme Inc." {...register(`experience.${index}.company`)} />
                    </FieldRow>
                    <FieldRow label="Location">
                      <Input placeholder="Remote" {...register(`experience.${index}.location`)} />
                    </FieldRow>
                    <FieldRow label="Start date">
                      <Input placeholder="Jan 2022" {...register(`experience.${index}.startDate`)} />
                    </FieldRow>
                    <FieldRow label="End date">
                      <Input
                        placeholder="Present"
                        disabled={Boolean(isCurrent)}
                        {...register(`experience.${index}.endDate`)}
                      />
                    </FieldRow>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          {...register(`experience.${index}.current`)}
                          onChange={(e) => {
                            register(`experience.${index}.current`).onChange(e);
                            if (e.target.checked) {
                              setValue(`experience.${index}.endDate`, '');
                            }
                          }}
                        />
                        I currently work here
                      </label>
                    </div>
                  </div>
                  <FieldRow label="Description">
                    <Textarea
                      className="min-h-[90px]"
                      placeholder="Describe your role and impact..."
                      {...register(`experience.${index}.description`)}
                    />
                  </FieldRow>
                  <Controller
                    control={control}
                    name={`experience.${index}.highlights`}
                    render={({ field: highlightsField }) => (
                      <HighlightsList
                        values={highlightsField.value ?? []}
                        onChange={highlightsField.onChange}
                      />
                    )}
                  />
                </div>
              </SortableItem>
            );
          })}
        </SortableList>
      )}

      <Button type="button" variant="outline" size="sm" onClick={() => append(emptyExperience)}>
        <Plus className="h-4 w-4 mr-1.5" />
        Add experience
      </Button>

      <ConfirmRemoveDialog
        open={removeIndex !== null}
        title="Remove experience?"
        onCancel={() => setRemoveIndex(null)}
        onConfirm={() => {
          if (removeIndex !== null) remove(removeIndex);
          setRemoveIndex(null);
        }}
      />
    </SectionCard>
  );
}
