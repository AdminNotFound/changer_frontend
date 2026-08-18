'use client';

import React from 'react';
import { Download, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { PdfFlowResult, PdfGenerationStatus } from '@/types/resume-pdf';

type PdfPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: PdfGenerationStatus;
  error: string | null;
  preview: PdfFlowResult | null;
  onRetry: () => void;
  onDownload: () => void;
};

export function PdfPreviewDialog({
  open,
  onOpenChange,
  status,
  error,
  preview,
  onRetry,
  onDownload,
}: PdfPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <DialogTitle>
            {status === 'generating'
              ? 'Generating PDF…'
              : preview?.fileName ?? 'PDF Preview'}
          </DialogTitle>
          <DialogDescription>
            {status === 'generating'
              ? 'Your resume is being rendered. This may take a moment.'
              : status === 'error'
                ? 'PDF generation failed.'
                : 'Preview your resume as a PDF.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 relative bg-gray-50">
          {status === 'generating' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <p className="text-sm text-gray-600">Generating PDF…</p>
            </div>
          ) : status === 'error' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <p className="text-sm font-medium text-red-700">
                {error ?? 'Something went wrong while generating the PDF.'}
              </p>
              <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Retry
              </Button>
            </div>
          ) : preview?.blobUrl ? (
            <iframe
              title={preview.fileName}
              src={preview.blobUrl}
              className="h-full w-full border-0 bg-white"
            />
          ) : null}
        </div>

        {status === 'success' && preview ? (
          <DialogFooter className="px-6 py-4 border-t border-gray-100 shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button type="button" onClick={onDownload}>
              <Download className="h-4 w-4 mr-1.5" />
              Download
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
