'use client';

import React, { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmRemoveDialog } from '../shared/confirm-remove-dialog';
import { FieldRow } from '../shared/field-row';
import { SectionCard } from '../shared/section-card';
import { SortableItem, SortableList } from '../shared/sortable-list';

const emptyLanguage = {
  name: '',
  proficiency: '',
};

export function LanguagesSection() {
  const { control, register, formState: { errors } } = useFormContext<ResumeSnapshot>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'languages',
  });
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const ids = fields.map((field) => field.id);
  const languageErrors = errors.languages;

  return (
    <SectionCard title="Languages" description="Languages you speak and proficiency levels">
      {fields.length === 0 ? (
        <p className="text-xs text-gray-500">No languages yet.</p>
      ) : (
        <SortableList ids={ids} onReorder={move}>
          {fields.map((field, index) => (
            <SortableItem key={field.id} id={field.id}>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-gray-700">Language {index + 1}</p>
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
                  <FieldRow
                    label="Language"
                    error={languageErrors?.[index]?.name?.message}
                  >
                    <Input placeholder="English" {...register(`languages.${index}.name`)} />
                  </FieldRow>
                  <FieldRow label="Proficiency">
                    <Input placeholder="Native, Fluent, Intermediate" {...register(`languages.${index}.proficiency`)} />
                  </FieldRow>
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableList>
      )}

      <Button type="button" variant="outline" size="sm" onClick={() => append(emptyLanguage)}>
        <Plus className="h-4 w-4 mr-1.5" />
        Add language
      </Button>

      <ConfirmRemoveDialog
        open={removeIndex !== null}
        title="Remove language?"
        onCancel={() => setRemoveIndex(null)}
        onConfirm={() => {
          if (removeIndex !== null) remove(removeIndex);
          setRemoveIndex(null);
        }}
      />
    </SectionCard>
  );
}
