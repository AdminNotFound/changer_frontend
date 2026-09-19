'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { handleApiError } from '@/lib/api/error';
import { useMyResumes } from '@/features/resume/hooks/use-resumes';
import type { TailorEnqueueInput } from '@/types/resume-tailoring';

const MIN_JD_LENGTH = 30;

export type TailorFormSubmit = {
  resumeId: string;
  input: TailorEnqueueInput;
};

type TailorFormProps = {
  onSubmit: (payload: TailorFormSubmit) => void;
  isSubmitting: boolean;
};

export function TailorForm({ onSubmit, isSubmitting }: TailorFormProps) {
  const [resumeId, setResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [errors, setErrors] = useState<{ resumeId?: string; jobDescription?: string }>({});

  const { data, isLoading, isError, error } = useMyResumes({
    page: 1,
    limit: 50,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });

  const resumes = data?.resumes ?? [];

  const validate = () => {
    const next: { resumeId?: string; jobDescription?: string } = {};
    if (!resumeId) {
      next.resumeId = 'Select a resume to tailor.';
    }
    const trimmed = jobDescription.trim();
    if (!trimmed) {
      next.jobDescription = 'Job description cannot be empty.';
    } else if (trimmed.length < MIN_JD_LENGTH) {
      next.jobDescription = `Job description must be at least ${MIN_JD_LENGTH} characters.`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;
    onSubmit({
      resumeId,
      input: {
        jobDescription: jobDescription.trim(),
        source: 'draft',
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tailor a resume</CardTitle>
        <CardDescription>
          Choose a resume and paste the job description. The server rewrites the draft and saves a
          new version.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="tailor-resume" className="mb-1.5 block text-sm font-medium text-gray-700">
              Resume
            </label>
            {isLoading ? (
              <div className="h-11 animate-pulse rounded-xl bg-gray-100" />
            ) : isError ? (
              <p className="text-sm text-red-600">{handleApiError(error).message}</p>
            ) : resumes.length === 0 ? (
              <p className="text-sm text-gray-500">
                No resumes yet.{' '}
                <Link href="/resumes" className="font-medium text-purple-700 hover:underline">
                  Create one first
                </Link>
                .
              </p>
            ) : (
              <select
                id="tailor-resume"
                value={resumeId}
                onChange={(e) => {
                  setResumeId(e.target.value);
                  if (errors.resumeId) setErrors((prev) => ({ ...prev, resumeId: undefined }));
                }}
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a resume…</option>
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.title}
                  </option>
                ))}
              </select>
            )}
            {errors.resumeId ? (
              <p className="mt-1.5 text-xs font-medium text-red-600">{errors.resumeId}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="tailor-jd" className="mb-1.5 block text-sm font-medium text-gray-700">
              Job description
            </label>
            <Textarea
              id="tailor-jd"
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                if (errors.jobDescription) {
                  setErrors((prev) => ({ ...prev, jobDescription: undefined }));
                }
              }}
              placeholder="Paste the full job description here…"
              className="min-h-[220px]"
              disabled={isSubmitting}
            />
            <div className="mt-1.5 flex items-center justify-between">
              {errors.jobDescription ? (
                <p className="text-xs font-medium text-red-600">{errors.jobDescription}</p>
              ) : (
                <p className="text-xs text-gray-400">At least {MIN_JD_LENGTH} characters.</p>
              )}
              <p className="text-xs tabular-nums text-gray-400">
                {jobDescription.trim().length}
              </p>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting || resumes.length === 0}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? 'Tailoring…' : 'Start tailoring'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
