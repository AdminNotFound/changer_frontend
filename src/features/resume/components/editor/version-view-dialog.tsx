'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { handleApiError } from '@/lib/api/error';
import { useVersion } from '@/features/resume/hooks/use-version-history';
import { formatVersionDate } from '@/features/resume/utils/version-format';
import { PreviewSections } from './preview/preview-sections';

type VersionViewDialogProps = {
  resumeId: string;
  versionId: string | null;
  templateId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function VersionViewDialog({
  resumeId,
  versionId,
  templateId,
  open,
  onOpenChange,
}: VersionViewDialogProps) {
  const { data: version, isLoading, isError, error } = useVersion(
    resumeId,
    versionId ?? '',
    open && Boolean(versionId)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {version ? `Version ${version.versionNumber}` : 'View version'}
          </DialogTitle>
          <DialogDescription>
            {version
              ? `${formatVersionDate(version.createdAt)}${version.changeSummary ? ` — ${version.changeSummary}` : ''}`
              : 'Read-only snapshot preview'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {handleApiError(error).message}
            </div>
          ) : version ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">v{version.versionNumber}</Badge>
                {version.changeSummary ? (
                  <Badge variant="outline">{version.changeSummary}</Badge>
                ) : null}
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <PreviewSections snapshot={version.snapshot} templateId={templateId} />
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
