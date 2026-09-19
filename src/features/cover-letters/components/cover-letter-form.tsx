'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2, Sparkles } from 'lucide-react';
import { QueryErrorRetry } from '@/components/common/query-error-retry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/cn';
import { handleApiError } from '@/lib/api/error';
import { useMyResumes } from '@/features/resume/hooks/use-resumes';
import {
  COVER_LETTER_TONE_LABELS,
  COVER_LETTER_TONES,
  type CoverLetterTone,
  type GenerateCoverLetterInput,
} from '@/types/cover-letter';

const MIN_JD_LENGTH = 30;
const MAX_TITLE_LENGTH = 200;

export type CoverLetterFormSubmit = {
  resumeId: string;
  resumeTitle: string;
  input: GenerateCoverLetterInput;
};

type CoverLetterFormProps = {
  onSubmit: (payload: CoverLetterFormSubmit) => void;
  isSubmitting: boolean;
};

export function CoverLetterForm({ onSubmit, isSubmitting }: CoverLetterFormProps) {
  const [resumeId, setResumeId] = useState('');
  const [title, setTitle] = useState('');
  const [tone, setTone] = useState<CoverLetterTone>('formal');
  const [jobDescription, setJobDescription] = useState('');
  const [errors, setErrors] = useState<{
    resumeId?: string;
    title?: string;
    jobDescription?: string;
  }>({});

  const { data, isLoading, isError, error, refetch } = useMyResumes({
    page: 1,
    limit: 50,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });

  const resumes = data?.resumes ?? [];

  const validate = () => {
    const next: { resumeId?: string; title?: string; jobDescription?: string } = {};
    if (!resumeId) {
      next.resumeId = 'Select a resume to write from.';
    }
    const trimmedTitle = title.trim();
    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      next.title = `Title must be at most ${MAX_TITLE_LENGTH} characters.`;
    }
    const trimmedJd = jobDescription.trim();
    if (!trimmedJd) {
      next.jobDescription = 'Job description cannot be empty.';
    } else if (trimmedJd.length < MIN_JD_LENGTH) {
      next.jobDescription = `Job description must be at least ${MIN_JD_LENGTH} characters.`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;
    const resume = resumes.find((item) => item.id === resumeId);
    const trimmedTitle = title.trim();
    onSubmit({
      resumeId,
      resumeTitle: resume?.title ?? 'Resume',
      input: {
        jobDescription: jobDescription.trim(),
        tone,
        source: 'draft',
        ...(trimmedTitle ? { title: trimmedTitle } : {}),
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a cover letter</CardTitle>
        <CardDescription>
          Choose a resume, paste the job description, and pick a writing style. Generation runs on
          the server.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="cover-letter-resume" className="mb-1.5 block text-sm font-medium text-gray-700">
              Resume
            </label>
            {isLoading ? (
              <div className="h-11 animate-pulse rounded-xl bg-gray-100" />
            ) : isError ? (
              <QueryErrorRetry
                message={handleApiError(error).message}
                onRetry={() => void refetch()}
              />
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
                id="cover-letter-resume"
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
            <label htmlFor="cover-letter-title" className="mb-1.5 block text-sm font-medium text-gray-700">
              Title <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <Input
              id="cover-letter-title"
              value={title}
              maxLength={MAX_TITLE_LENGTH}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Acme Corp — Product Designer"
              disabled={isSubmitting}
            />
            {errors.title ? (
              <p className="mt-1.5 text-xs font-medium text-red-600">{errors.title}</p>
            ) : null}
          </div>

          <div role="radiogroup" aria-label="Writing style">
            <p id="cover-letter-tone-label" className="mb-1.5 text-sm font-medium text-gray-700">
              Writing style
            </p>
            <div className="grid grid-cols-2 gap-2">
              {COVER_LETTER_TONES.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={tone === option}
                  disabled={isSubmitting}
                  onClick={() => setTone(option)}
                  className={cn(
                    'h-10 rounded-xl border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50',
                    tone === option
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {COVER_LETTER_TONE_LABELS[option]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="cover-letter-jd" className="mb-1.5 block text-sm font-medium text-gray-700">
              Job description
            </label>
            <Textarea
              id="cover-letter-jd"
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                if (errors.jobDescription) {
                  setErrors((prev) => ({ ...prev, jobDescription: undefined }));
                }
              }}
              placeholder="Paste the full job description here…"
              className="min-h-[180px]"
              disabled={isSubmitting}
            />
            <div className="mt-1.5 flex items-center justify-between">
              {errors.jobDescription ? (
                <p className="text-xs font-medium text-red-600">{errors.jobDescription}</p>
              ) : (
                <p className="text-xs text-gray-500">At least {MIN_JD_LENGTH} characters.</p>
              )}
              <p className="text-xs tabular-nums text-gray-500">
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
            {isSubmitting ? 'Generating…' : 'Generate'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
