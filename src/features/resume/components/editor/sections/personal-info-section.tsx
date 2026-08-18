'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import { Input } from '@/components/ui/input';
import { FieldRow } from '../shared/field-row';
import { SectionCard } from '../shared/section-card';

export function PersonalInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ResumeSnapshot>();

  const personalErrors = errors.personalInfo;

  return (
    <SectionCard
      title="Personal Information"
      description="Name, contact details, and profile links"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldRow label="Full name" htmlFor="fullName">
          <Input id="fullName" placeholder="Jane Doe" {...register('personalInfo.fullName')} />
        </FieldRow>
        <FieldRow
          label="Email"
          htmlFor="email"
          error={personalErrors?.email?.message}
        >
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            {...register('personalInfo.email')}
          />
        </FieldRow>
        <FieldRow label="Phone" htmlFor="phone">
          <Input id="phone" placeholder="+1 (555) 000-0000" {...register('personalInfo.phone')} />
        </FieldRow>
        <FieldRow label="Location" htmlFor="location">
          <Input id="location" placeholder="City, Country" {...register('personalInfo.location')} />
        </FieldRow>
        <FieldRow label="Website" htmlFor="website">
          <Input id="website" placeholder="https://yoursite.com" {...register('personalInfo.website')} />
        </FieldRow>
        <FieldRow label="LinkedIn" htmlFor="linkedin">
          <Input id="linkedin" placeholder="linkedin.com/in/you" {...register('personalInfo.linkedin')} />
        </FieldRow>
        <FieldRow label="GitHub" htmlFor="github" className="sm:col-span-2">
          <Input id="github" placeholder="github.com/you" {...register('personalInfo.github')} />
        </FieldRow>
      </div>
    </SectionCard>
  );
}
