'use client';

import React, { useEffect, useState } from 'react';
import { Download, Loader2, RefreshCw, Save, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/cn';
import { handleApiError } from '@/lib/api/error';
import { formatVersionDate } from '@/features/resume/utils/version-format';
import {
  COVER_LETTER_TONE_LABELS,
  COVER_LETTER_TONES,
  type CoverLetterTone,
} from '@/types/cover-letter';
import {
  useCoverLetter,
  useDeleteCoverLetterMutation,
  useDownloadCoverLetterMutation,
  useSaveCoverLetterMutation,
} from '../hooks/use-cover-letters';
import { CoverLetterConfirmDialog } from './cover-letter-confirm-dialog';

const MAX_TITLE_LENGTH = 200;

type CoverLetterEditorProps = {
  resumeId: string;
  coverLetterId: string;
  resumeTitle?: string;
  onDirtyChange?: (dirty: boolean) => void;
  onDeleted?: () => void;
  onRegenerate: (input: { tone: CoverLetterTone }) => void;
  isRegenerating?: boolean;
};

export function CoverLetterEditor({
  resumeId,
  coverLetterId,
  resumeTitle,
  onDirtyChange,
  onDeleted,
  onRegenerate,
  isRegenerating = false,
}: CoverLetterEditorProps) {
  const letterQuery = useCoverLetter(resumeId, coverLetterId);
  const saveMutation = useSaveCoverLetterMutation();
  const deleteMutation = useDeleteCoverLetterMutation();
  const downloadMutation = useDownloadCoverLetterMutation();

  const letter = letterQuery.data ?? null;
  const letterStamp = letter ? `${letter.id}:${letter.updatedAt}` : '';
  const [draftStamp, setDraftStamp] = useState(letterStamp);
  const [title, setTitle] = useState(letter?.title ?? '');
  const [content, setContent] = useState(letter?.content ?? '');
  const [tone, setTone] = useState<CoverLetterTone>(letter?.tone ?? 'formal');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);

  if (letterStamp !== draftStamp) {
    setDraftStamp(letterStamp);
    setTitle(letter?.title ?? '');
    setContent(letter?.content ?? '');
    setTone(letter?.tone ?? 'formal');
    setTitleError(null);
  }

  const isDirty = Boolean(
    letter && (title !== letter.title || content !== letter.content)
  );

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleSave = () => {
    if (!letter) return;
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Title cannot be empty.');
      return;
    }
    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      setTitleError(`Title must be at most ${MAX_TITLE_LENGTH} characters.`);
      return;
    }
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return;
    }
    saveMutation.mutate({
      resumeId: letter.resumeId,
      coverLetterId: letter.id,
      input: {
        title: trimmedTitle,
        content: trimmedContent,
      },
    });
  };

  const handleDelete = () => {
    if (!letter) return;
    deleteMutation.mutate(
      { resumeId: letter.resumeId, coverLetterId: letter.id },
      {
        onSuccess: () => {
          setDeleteOpen(false);
          onDeleted?.();
        },
      }
    );
  };

  if (letterQuery.isLoading) {
    return (
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Skeleton className="h-8 w-1/2 rounded-xl" />
          <Skeleton className="h-5 w-1/3 rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (letterQuery.isError) {
    return (
      <Card className="border-red-100 bg-red-50/60">
        <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 pt-6 text-center">
          <p className="font-semibold text-red-800">Couldn’t load cover letter</p>
          <p className="max-w-md text-sm text-red-600">
            {handleApiError(letterQuery.error).message}
          </p>
          <Button type="button" variant="outline" onClick={() => void letterQuery.refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!letter) return null;

  const busy =
    saveMutation.isPending ||
    deleteMutation.isPending ||
    downloadMutation.isPending ||
    isRegenerating;

  return (
    <>
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1">
              <CardTitle>Cover letter</CardTitle>
              <p className="text-sm text-gray-500">
                Edit the generated draft, then save. Regeneration replaces the body with a new AI
                draft.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={letter.status === 'saved' ? 'success' : 'secondary'}>
                {letter.status === 'saved' ? 'Saved' : 'Draft'}
              </Badge>
              <Badge variant="outline">{COVER_LETTER_TONE_LABELS[letter.tone]}</Badge>
            </div>
          </div>
          <dl className="grid gap-2 text-xs text-gray-500 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-gray-600">Resume</dt>
              <dd className="truncate">{resumeTitle ?? 'Associated resume'}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Regenerations</dt>
              <dd>{letter.regenerationCount}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Created</dt>
              <dd>{formatVersionDate(letter.createdAt)}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">Updated</dt>
              <dd>{formatVersionDate(letter.updatedAt)}</dd>
            </div>
          </dl>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label htmlFor="cover-letter-editor-title" className="mb-1.5 block text-sm font-medium text-gray-700">
              Title
            </label>
            <Input
              id="cover-letter-editor-title"
              value={title}
              maxLength={MAX_TITLE_LENGTH}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(null);
              }}
              disabled={busy}
            />
            {titleError ? (
              <p className="mt-1.5 text-xs font-medium text-red-600">{titleError}</p>
            ) : null}
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700">Writing style</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {COVER_LETTER_TONES.map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={busy}
                  onClick={() => setTone(option)}
                  className={cn(
                    'h-9 rounded-xl border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50',
                    tone === option
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {COVER_LETTER_TONE_LABELS[option]}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              Style applies the next time you regenerate.
            </p>
          </div>

          <div>
            <label htmlFor="cover-letter-editor-body" className="mb-1.5 block text-sm font-medium text-gray-700">
              Letter
            </label>
            <Textarea
              id="cover-letter-editor-body"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[360px] font-[Georgia,Cambria,'Times_New_Roman',serif] leading-7"
              disabled={busy}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={handleSave}
              disabled={busy || !isDirty || !content.trim()}
            >
              {saveMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onRegenerate({ tone })}
              disabled={busy}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                downloadMutation.mutate({
                  resumeId: letter.resumeId,
                  coverLetterId: letter.id,
                  title: title.trim() || letter.title,
                })
              }
              disabled={busy}
            >
              {downloadMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setDeleteOpen(true)}
              disabled={busy}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <CoverLetterConfirmDialog
        open={deleteOpen}
        title="Delete cover letter?"
        description="This permanently removes the letter. You cannot undo this action."
        confirmLabel={deleteMutation.isPending ? 'Deleting…' : 'Delete'}
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
