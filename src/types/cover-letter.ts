import type { PageMeta } from '@/types/resume';

export type CoverLetterTone = 'formal' | 'startup' | 'corporate' | 'friendly';

export type CoverLetterSource = 'draft' | 'published';

export type CoverLetterStatus = 'draft' | 'saved';

export type CoverLetterJobStatus =
  | 'queued'
  | 'waiting'
  | 'active'
  | 'completed'
  | 'failed'
  | 'delayed';

export const COVER_LETTER_TONES: CoverLetterTone[] = [
  'formal',
  'startup',
  'corporate',
  'friendly',
];

export const COVER_LETTER_TONE_LABELS: Record<CoverLetterTone, string> = {
  formal: 'Formal',
  startup: 'Startup',
  corporate: 'Corporate',
  friendly: 'Friendly',
};

export type PublicCoverLetter = {
  id: string;
  userId: string;
  resumeId: string;
  title: string;
  jobDescription: string;
  tone: CoverLetterTone;
  content: string;
  source: CoverLetterSource;
  status: CoverLetterStatus;
  regenerationCount: number;
  createdAt: string;
  updatedAt: string;
};

export type DashboardCoverLetterItem = {
  id: string;
  resumeId: string;
  resumeTitle: string;
  title: string;
  tone: CoverLetterTone;
  status: CoverLetterStatus;
  regenerationCount: number;
  createdAt: string;
  updatedAt: string;
};

export type GenerateCoverLetterInput = {
  jobDescription: string;
  tone: CoverLetterTone;
  source?: CoverLetterSource;
  title?: string;
};

export type RegenerateCoverLetterInput = {
  jobDescription?: string;
  tone?: CoverLetterTone;
  source?: CoverLetterSource;
};

export type SaveCoverLetterInput = {
  content?: string;
  title?: string;
};

export type CoverLetterEnqueueResult = {
  jobId: string;
  queue: string;
  status: 'queued';
};

export type CoverLetterJobView = {
  jobId: string;
  queue: string;
  name: string;
  status: CoverLetterJobStatus;
  progress: number | object | string | boolean;
  attemptsMade: number;
  failedReason: string | null;
  result: PublicCoverLetter | null;
  createdAt: number | null;
  finishedAt: number | null;
};

export type CoverLettersQuery = {
  page?: number;
  limit?: number;
  q?: string;
  resumeId?: string;
  tone?: CoverLetterTone;
  status?: CoverLetterStatus;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
};

export type CoverLettersResponse = {
  coverLetters: DashboardCoverLetterItem[];
  meta: PageMeta;
};
