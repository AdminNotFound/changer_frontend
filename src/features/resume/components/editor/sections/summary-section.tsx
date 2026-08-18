'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import { Textarea } from '@/components/ui/textarea';
import { FieldRow } from '../shared/field-row';
import { SectionCard } from '../shared/section-card';

export function SummarySection() {
  const { register } = useFormContext<ResumeSnapshot>();

  return (
    <SectionCard
      title="Professional Summary"
      description="A brief overview of your experience and goals"
    >
      <FieldRow label="Summary" htmlFor="summary">
        <Textarea
          id="summary"
          placeholder="Experienced software engineer with a passion for building scalable products..."
          className="min-h-[140px]"
          {...register('summary')}
        />
      </FieldRow>
    </SectionCard>
  );
}
