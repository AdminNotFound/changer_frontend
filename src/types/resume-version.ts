import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';

export type VersionHistoryItem = {
  id: string;
  versionNumber: number;
  changeSummary: string | null;
  createdBy: string;
  createdAt: string;
};

export type PublicVersion = {
  id: string;
  resumeId: string;
  userId: string;
  versionNumber: number;
  snapshot: ResumeSnapshot;
  changeSummary: string | null;
  createdBy: string;
  createdAt: string;
};

export type DiffEntryType = 'added' | 'removed' | 'changed';

export type DiffEntry = {
  path: string;
  type: DiffEntryType;
  before?: unknown;
  after?: unknown;
};

export type VersionCompareParams =
  | { from: string; to: string }
  | { fromVersion: number; toVersion: number };

export type VersionCompareResult = {
  from: VersionHistoryItem;
  to: VersionHistoryItem;
  diff: DiffEntry[];
};

export type RestoreVersionResult = {
  resume: import('@/types/resume').PublicResume;
  version: PublicVersion | null;
  created: boolean;
};
