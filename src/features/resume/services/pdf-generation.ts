import { handleApiError } from '@/lib/api/error';
import {
  base64ToBlob,
  createBlobUrl,
} from '@/lib/utils/download-blob';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import type {
  PdfFlowResult,
  PdfGenerationMode,
  PdfJobStatus,
  PdfSource,
} from '@/types/resume-pdf';
import { pdfApi } from '../api/pdf-api';

const POLLING_STATUSES: PdfJobStatus[] = [
  'queued',
  'waiting',
  'active',
  'delayed',
];

const POLL_INTERVAL_MS = 1500;
const MAX_POLL_ATTEMPTS = 120;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function pollPdfJob(jobId: string): Promise<{ fileName: string; blob: Blob }> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const job = await pdfApi.getJobStatus(jobId);

    if (job.status === 'completed') {
      const result = job.result;
      if (!result?.pdfBase64 || !result.fileName) {
        throw new Error('PDF result is missing from completed job');
      }
      const blob = base64ToBlob(result.pdfBase64, 'application/pdf');
      return { fileName: result.fileName, blob };
    }

    if (job.status === 'failed') {
      throw new Error(job.failedReason || 'PDF generation failed');
    }

    if (POLLING_STATUSES.includes(job.status)) {
      await sleep(POLL_INTERVAL_MS);
      continue;
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error('PDF generation timed out. Please try again.');
}

export type RunPdfFlowOptions = {
  resumeId: string;
  mode: PdfGenerationMode;
  source?: PdfSource;
  flushSave?: () => Promise<unknown>;
  hasUnsavedChanges?: boolean;
};

export async function runPdfFlow({
  resumeId,
  mode,
  source = 'draft',
  flushSave,
  hasUnsavedChanges = false,
}: RunPdfFlowOptions): Promise<PdfFlowResult> {
  try {
    if (hasUnsavedChanges && flushSave) {
      await flushSave();
    }

    const enqueue =
      mode === 'preview'
        ? pdfApi.enqueuePreview(resumeId, source)
        : pdfApi.enqueueDownload(resumeId, source);

    const { jobId } = await enqueue;
    const { fileName, blob } = await pollPdfJob(jobId);
    const blobUrl = createBlobUrl(blob);

    return { fileName, blob, blobUrl };
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function flushEditorDraft(
  getValues: () => ResumeSnapshot,
  flushSave: (values: ResumeSnapshot) => Promise<unknown>,
  hasUnsavedChanges: boolean
): Promise<void> {
  if (!hasUnsavedChanges) return;
  await flushSave(getValues());
}
