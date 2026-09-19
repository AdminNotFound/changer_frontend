import { handleApiError } from '@/lib/api/error';
import {
  base64ToBlob,
  createBlobUrl,
} from '@/lib/utils/download-blob';
import type {
  PdfFlowResult,
  PdfGenerationMode,
  PdfJobView,
  PdfSource,
} from '@/types/resume-pdf';
import { pdfApi } from '../api/pdf-api';

export type EnqueuePdfJobOptions = {
  resumeId: string;
  mode: PdfGenerationMode;
  source?: PdfSource;
  flushSave?: () => Promise<unknown>;
  hasUnsavedChanges?: boolean;
};

export async function enqueuePdfJob({
  resumeId,
  mode,
  source = 'draft',
  flushSave,
  hasUnsavedChanges = false,
}: EnqueuePdfJobOptions): Promise<string> {
  try {
    if (hasUnsavedChanges && flushSave) {
      await flushSave();
    }

    const enqueue =
      mode === 'preview'
        ? pdfApi.enqueuePreview(resumeId, source)
        : pdfApi.enqueueDownload(resumeId, source);

    const { jobId } = await enqueue;
    return jobId;
  } catch (error) {
    throw handleApiError(error);
  }
}

export function jobToPdfFlowResult(job: PdfJobView): PdfFlowResult {
  const result = job.result;
  if (!result?.pdfBase64 || !result.fileName) {
    throw new Error('PDF result is missing from completed job');
  }
  const blob = base64ToBlob(result.pdfBase64, 'application/pdf');
  return {
    fileName: result.fileName,
    blob,
    blobUrl: createBlobUrl(blob),
  };
}
