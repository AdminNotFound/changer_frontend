export type PdfSource = 'draft' | 'published';

export type PdfJobStatus =
  | 'queued'
  | 'waiting'
  | 'active'
  | 'completed'
  | 'failed'
  | 'delayed';

export type PdfEnqueueResult = {
  jobId: string;
  queue: string;
  status: 'queued';
};

export type PdfJobResult = {
  fileName: string;
  pdfBase64: string;
};

export type PdfJobView = {
  jobId: string;
  queue: string;
  name: string;
  status: PdfJobStatus;
  progress: number | object | string | boolean;
  attemptsMade: number;
  failedReason: string | null;
  result: PdfJobResult | null;
  createdAt: number | null;
  finishedAt: number | null;
};

export type PdfGenerationMode = 'preview' | 'download';

export type PdfGenerationStatus = 'idle' | 'generating' | 'success' | 'error';

export type PdfFlowResult = {
  fileName: string;
  blob: Blob;
  blobUrl: string;
};
