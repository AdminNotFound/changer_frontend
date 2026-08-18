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

const emptyCertification = {
  name: '',
  issuer: '',
  date: '',
  url: '',
};

export function CertificationsSection() {
  const { control, register } = useFormContext<ResumeSnapshot>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'certifications',
  });
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const ids = fields.map((field) => field.id);

  return (
    <SectionCard title="Certifications" description="Professional certifications and credentials">
      {fields.length === 0 ? (
        <p className="text-xs text-gray-500">No certifications yet.</p>
      ) : (
        <SortableList ids={ids} onReorder={move}>
          {fields.map((field, index) => (
            <SortableItem key={field.id} id={field.id}>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-gray-700">Certification {index + 1}</p>
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
                  <FieldRow label="Name">
                    <Input placeholder="AWS Solutions Architect" {...register(`certifications.${index}.name`)} />
                  </FieldRow>
                  <FieldRow label="Issuer">
                    <Input placeholder="Amazon Web Services" {...register(`certifications.${index}.issuer`)} />
                  </FieldRow>
                  <FieldRow label="Date">
                    <Input placeholder="2024" {...register(`certifications.${index}.date`)} />
                  </FieldRow>
                  <FieldRow label="URL">
                    <Input placeholder="https://..." {...register(`certifications.${index}.url`)} />
                  </FieldRow>
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableList>
      )}

      <Button type="button" variant="outline" size="sm" onClick={() => append(emptyCertification)}>
        <Plus className="h-4 w-4 mr-1.5" />
        Add certification
      </Button>

      <ConfirmRemoveDialog
        open={removeIndex !== null}
        title="Remove certification?"
        onCancel={() => setRemoveIndex(null)}
        onConfirm={() => {
          if (removeIndex !== null) remove(removeIndex);
          setRemoveIndex(null);
        }}
      />
    </SectionCard>
  );
}
