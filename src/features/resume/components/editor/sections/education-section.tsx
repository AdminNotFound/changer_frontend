'use client';

import React, { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmRemoveDialog } from '../shared/confirm-remove-dialog';
import { FieldRow } from '../shared/field-row';
import { SectionCard } from '../shared/section-card';
import { SortableItem, SortableList } from '../shared/sortable-list';

const emptyEducation = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  description: '',
};

export function EducationSection() {
  const { control, register } = useFormContext<ResumeSnapshot>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'education',
  });
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const ids = fields.map((field) => field.id);

  return (
    <SectionCard title="Education" description="Degrees and academic background">
      {fields.length === 0 ? (
        <p className="text-xs text-gray-500">No education entries yet.</p>
      ) : (
        <SortableList ids={ids} onReorder={move}>
          {fields.map((field, index) => (
            <SortableItem key={field.id} id={field.id}>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-gray-700">Education {index + 1}</p>
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
                  <FieldRow label="Institution">
                    <Input placeholder="University name" {...register(`education.${index}.institution`)} />
                  </FieldRow>
                  <FieldRow label="Degree">
                    <Input placeholder="B.S. Computer Science" {...register(`education.${index}.degree`)} />
                  </FieldRow>
                  <FieldRow label="Field of study">
                    <Input placeholder="Computer Science" {...register(`education.${index}.field`)} />
                  </FieldRow>
                  <FieldRow label="Start date">
                    <Input placeholder="2018" {...register(`education.${index}.startDate`)} />
                  </FieldRow>
                  <FieldRow label="End date" className="sm:col-span-2">
                    <Input placeholder="2022" {...register(`education.${index}.endDate`)} />
                  </FieldRow>
                </div>
                <FieldRow label="Description">
                  <Textarea
                    className="min-h-[80px]"
                    placeholder="Honors, coursework, activities..."
                    {...register(`education.${index}.description`)}
                  />
                </FieldRow>
              </div>
            </SortableItem>
          ))}
        </SortableList>
      )}

      <Button type="button" variant="outline" size="sm" onClick={() => append(emptyEducation)}>
        <Plus className="h-4 w-4 mr-1.5" />
        Add education
      </Button>

      <ConfirmRemoveDialog
        open={removeIndex !== null}
        title="Remove education?"
        onCancel={() => setRemoveIndex(null)}
        onConfirm={() => {
          if (removeIndex !== null) remove(removeIndex);
          setRemoveIndex(null);
        }}
      />
    </SectionCard>
  );
}
