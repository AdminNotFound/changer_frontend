import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';

export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type DashboardResumeItem = {
  id: string;
  title: string;
  templateId: string;
  currentVersionNumber: number;
  hasPublished: boolean;
  lastEditedAt: string | null;
  lastSavedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicResume = {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  draft: ResumeSnapshot;
  published: ResumeSnapshot | null;
  currentVersionNumber: number;
  lastEditedAt: string | null;
  lastSavedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateResumeInput = {
  title?: string;
};

export type ResumeSortBy = 'updatedAt' | 'createdAt' | 'lastEditedAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export type MyResumesQuery = {
  page?: number;
  limit?: number;
  q?: string;
  sortBy?: ResumeSortBy;
  sortOrder?: SortOrder;
  templateId?: string;
};

export type DashboardStatistics = {
  totalResumes: number;
  totalVersions: number;
  averageAtsScore: number | null;
  recentActivity: Array<{
    type:
      | 'resume_updated'
      | 'version_created'
      | 'ats_scored'
      | 'tailored'
      | 'cover_letter';
    id: string;
    resumeId?: string;
    title: string;
    occurredAt: string;
  }>;
};

export type { ResumeSnapshot };
