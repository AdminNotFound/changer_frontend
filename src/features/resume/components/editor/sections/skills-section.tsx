'use client';

import React, { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmRemoveDialog } from '../shared/confirm-remove-dialog';
import { SectionCard } from '../shared/section-card';
import { SortableItem, SortableList } from '../shared/sortable-list';

export function SkillsSection() {
  const { watch, setValue } = useFormContext<ResumeSnapshot>();
  const skills = watch('skills') ?? [];
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const ids = useMemo(
    () => skills.map((_, index) => `skill-${index}`),
    [skills]
  );

  const updateSkill = (index: number, value: string) => {
    const next = [...skills];
    next[index] = value;
    setValue('skills', next, { shouldDirty: true });
  };

  const addSkill = () => {
    setValue('skills', [...skills, ''], { shouldDirty: true });
  };

  const removeSkill = (index: number) => {
    setValue(
      'skills',
      skills.filter((_, i) => i !== index),
      { shouldDirty: true }
    );
  };

  const reorderSkills = (from: number, to: number) => {
    const next = [...skills];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setValue('skills', next, { shouldDirty: true });
  };

  return (
    <SectionCard title="Skills" description="Add skills and reorder by priority">
      {skills.length === 0 ? (
        <p className="text-xs text-gray-500">No skills yet. Add your first skill below.</p>
      ) : (
        <SortableList ids={ids} onReorder={reorderSkills}>
          {skills.map((skill, index) => (
            <SortableItem key={ids[index]} id={ids[index]}>
              <div className="flex items-center gap-2">
                <Input
                  value={skill}
                  placeholder="e.g. TypeScript, React, Node.js"
                  onChange={(e) => updateSkill(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 px-2.5"
                  onClick={() => setRemoveIndex(index)}
                  aria-label="Remove skill"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </SortableItem>
          ))}
        </SortableList>
      )}

      <Button type="button" variant="outline" size="sm" onClick={addSkill}>
        <Plus className="h-4 w-4 mr-1.5" />
        Add skill
      </Button>

      <ConfirmRemoveDialog
        open={removeIndex !== null}
        title="Remove skill?"
        onCancel={() => setRemoveIndex(null)}
        onConfirm={() => {
          if (removeIndex !== null) removeSkill(removeIndex);
          setRemoveIndex(null);
        }}
      />
    </SectionCard>
  );
}
