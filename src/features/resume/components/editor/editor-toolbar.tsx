'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, History, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatVersionDate } from '@/features/resume/utils/version-format';
import { TemplateSelector } from './template-selector';
import { PdfActionsMenu } from './pdf-actions-menu';
import type { PdfGenerationStatus } from '@/types/resume-pdf';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type EditorToolbarProps = {
  title: string;
  resumeId: string;
  templateId: string;
  isDirty: boolean;
  saveStatus: SaveStatus;
  apiError: string | null;
  onSave: () => void;
  isSaving: boolean;
  lastSavedAt: string | null;
  currentVersionNumber: number;
  onOpenVersionHistory: () => void;
  pdfStatus: PdfGenerationStatus;
  onPreviewPdf: () => void;
  onDownloadPdf: () => void;
};

export function EditorToolbar({
  title,
  resumeId,
  templateId,
  isDirty,
  saveStatus,
  apiError,
  onSave,
  isSaving,
  lastSavedAt,
  currentVersionNumber,
  onOpenVersionHistory,
  pdfStatus,
  onPreviewPdf,
  onDownloadPdf,
}: EditorToolbarProps) {
  const [leaveOpen, setLeaveOpen] = useState(false);
  const isSavingState = isSaving || saveStatus === 'saving';

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty || isSavingState) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty, isSavingState]);

  const statusLabel =
    saveStatus === 'saving'
      ? 'Saving…'
      : saveStatus === 'saved'
        ? 'Saved'
        : saveStatus === 'error'
          ? 'Failed to save'
          : isDirty
            ? 'Unsaved changes'
            : 'All changes saved';

  const statusVariant =
    saveStatus === 'error'
      ? 'destructive' as const
      : saveStatus === 'saved' || !isDirty
        ? 'success' as const
        : 'outline' as const;

  const handleBackClick = () => {
    if (isSavingState) return;
    if (isDirty) {
      setLeaveOpen(true);
    }
  };

  return (
    <>
      <div className="sticky top-16 z-10 -mx-4 sm:-mx-6 lg:-mx-8 mb-4 border-b border-gray-100 bg-[#faf9fc]/95 px-4 sm:px-6 lg:px-8 py-3 backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {isDirty || isSavingState ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="shrink-0 -ml-2"
                disabled={isSavingState}
                onClick={handleBackClick}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back
              </Button>
            ) : (
              <Button asChild variant="ghost" size="sm" className="shrink-0 -ml-2">
                <Link href="/resumes">
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Back
                </Link>
              </Button>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-bold text-gray-900 truncate">{title}</h1>
                {currentVersionNumber > 0 ? (
                  <Badge variant="secondary">v{currentVersionNumber}</Badge>
                ) : null}
              </div>
              <p className="text-xs text-gray-500">
                {lastSavedAt
                  ? `Last saved ${formatVersionDate(lastSavedAt)}`
                  : 'Not saved yet'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Badge variant={statusVariant} className="hidden sm:inline-flex">
              {saveStatus === 'saved' ? (
                <Check className="h-3 w-3 mr-1" />
              ) : null}
              {statusLabel}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenVersionHistory}
            >
              <History className="h-4 w-4 mr-1.5" />
              History
            </Button>
            <TemplateSelector resumeId={resumeId} currentTemplateId={templateId} />
            <PdfActionsMenu
              status={pdfStatus}
              onPreview={onPreviewPdf}
              onDownload={onDownloadPdf}
            />
            <Button
              type="button"
              onClick={onSave}
              disabled={!isDirty || isSavingState}
              size="sm"
            >
              {isSavingState ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                <Save className="h-4 w-4 mr-1.5" />
              )}
              Save
            </Button>
          </div>
        </div>

        {apiError ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {apiError}
          </div>
        ) : null}

        <Badge variant={statusVariant} className="mt-2 sm:hidden">
          {statusLabel}
        </Badge>
      </div>

      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isSavingState ? 'Save in progress' : 'Leave without saving?'}
            </DialogTitle>
            <DialogDescription>
              {isSavingState
                ? 'Please wait for the current save to finish before leaving.'
                : 'You have unsaved changes. If you leave now, your edits may be lost.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setLeaveOpen(false)}>
              {isSavingState ? 'OK' : 'Stay'}
            </Button>
            {!isSavingState ? (
              <Button asChild variant="default">
                <Link href="/resumes">Leave anyway</Link>
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
