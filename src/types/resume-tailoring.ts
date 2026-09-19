import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import type { PageMeta, PublicResume } from '@/types/resume';
import type { PublicVersion } from '@/types/resume-version';

export type TailorJobStatus =
  | 'queued'
  | 'waiting'
  | 'active'
  | 'completed'
  | 'failed'
  | 'delayed';

export type TailorSource = 'draft' | 'published';

export type TailorEnqueueInput = {
  jobDescription: string;
  source?: TailorSource;
};

export type TailorEnqueueResult = {
  jobId: string;
  queue: string;
  status: 'queued';
};

export type TailoringResult = {
  tailoredResume: ResumeSnapshot;
  changedSections: string[];
  addedKeywords: string[];
  missingKeywords: string[];
  resume: PublicResume;
  version: PublicVersion | null;
  versionCreated: boolean;
};

export type TailorJobView = {
  jobId: string;
  queue: string;
  name: string;
  status: TailorJobStatus;
  progress: number | object | string | boolean;
  attemptsMade: number;
  failedReason: string | null;
  result: TailoringResult | null;
  createdAt: number | null;
  finishedAt: number | null;
};

export type RecentTailoredItem = {
  versionId: string;
  resumeId: string;
  resumeTitle: string;
  versionNumber: number;
  changeSummary: string | null;
  createdAt: string;
};

export type RecentTailoredQuery = {
  page?: number;
  limit?: number;
  q?: string;
  resumeId?: string;
  sortBy?: 'createdAt' | 'versionNumber';
  sortOrder?: 'asc' | 'desc';
};

export type RecentTailoredResponse = {
  tailored: RecentTailoredItem[];
  meta: PageMeta;
};
