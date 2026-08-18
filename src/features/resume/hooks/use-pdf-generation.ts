'use client';

import { useCallback, useRef, useState } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { handleApiError } from '@/lib/api/error';
import type {
  PdfFlowResult,
  PdfGenerationMode,
  PdfGenerationStatus,
  PdfSource,
} from '@/types/resume-pdf';
import { downloadBlob, revokeBlobUrl } from '@/lib/utils/download-blob';
import { runPdfFlow } from '../services/pdf-generation';

type UsePdfGenerationOptions = {
  resumeId: string;
  source?: PdfSource;
  flushSave?: () => Promise<unknown>;
  hasUnsavedChanges?: boolean;
};

export function usePdfGeneration({
  resumeId,
  source = 'draft',
  flushSave,
  hasUnsavedChanges = false,
}: UsePdfGenerationOptions) {
  const addToast = useUIStore((s) => s.addToast);
  const [status, setStatus] = useState<PdfGenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PdfFlowResult | null>(null);
  const previewBlobUrlRef = useRef<string | null>(null);

  const clearPreviewBlob = useCallback(() => {
    revokeBlobUrl(previewBlobUrlRef.current);
    previewBlobUrlRef.current = null;
  }, []);

  const reset = useCallback(() => {
    clearPreviewBlob();
    setPreview(null);
    setError(null);
    setStatus('idle');
  }, [clearPreviewBlob]);

  const run = useCallback(
    async (mode: PdfGenerationMode) => {
      setStatus('generating');
      setError(null);

      try {
        const result = await runPdfFlow({
          resumeId,
          mode,
          source,
          flushSave,
          hasUnsavedChanges,
        });

        if (mode === 'download') {
          downloadBlob(result.blob, result.fileName);
          revokeBlobUrl(result.blobUrl);
          setStatus('success');
          addToast({ type: 'success', message: 'PDF downloaded successfully' });
          return null;
        }

        clearPreviewBlob();
        previewBlobUrlRef.current = result.blobUrl;
        setPreview(result);
        setStatus('success');
        addToast({ type: 'success', message: 'PDF ready to preview' });
        return result;
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
        setStatus('error');
        addToast({ type: 'error', message: apiError.message });
        return null;
      }
    },
    [resumeId, source, flushSave, hasUnsavedChanges, clearPreviewBlob, addToast]
  );

  const previewPdf = useCallback(() => run('preview'), [run]);
  const downloadPdf = useCallback(() => run('download'), [run]);

  const downloadPreview = useCallback(() => {
    if (!preview) return;
    downloadBlob(preview.blob, preview.fileName);
    addToast({ type: 'success', message: 'PDF downloaded successfully' });
  }, [preview, addToast]);

  return {
    status,
    error,
    preview,
    previewPdf,
    downloadPdf,
    downloadPreview,
    reset,
    isGenerating: status === 'generating',
  };
}
