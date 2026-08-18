import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import type { PublicResume } from '@/types/resume';

export type ImportJobStatus =
  | 'queued'
  | 'waiting'
  | 'active'
  | 'completed'
  | 'failed'
  | 'delayed';

export type ImportPreviewEnqueueResult = {
  jobId: string;
  queue: string;
  status: 'queued';
};

export type ImportPreviewMeta = {
  format: 'pdf' | 'docx';
  fileName: string;
  characterCount: number;
};

export type ImportPreviewResult = {
  extracted: ResumeSnapshot;
  meta: ImportPreviewMeta;
};

export type ImportJobView = {
  jobId: string;
  queue: string;
  name: string;
  status: ImportJobStatus;
  progress: number | object | string | boolean;
  attemptsMade: number;
  failedReason: string | null;
  result: ImportPreviewResult | null;
  createdAt: number | null;
  finishedAt: number | null;
};

export type ImportConfirmInput = {
  title?: string;
  content: ResumeSnapshot;
};

export type ImportConfirmResult = {
  resume: PublicResume;
  extracted: ResumeSnapshot;
};
