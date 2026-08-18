import { apiClient } from '@/lib/api/axios';
import { ApiSuccessResponse } from '@/types/api';
import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';
import {
  CreateResumeInput,
  DashboardResumeItem,
  MyResumesQuery,
  PageMeta,
  PublicResume,
} from '@/types/resume';

export type MyResumesResponse = {
  resumes: DashboardResumeItem[];
  meta: PageMeta;
};

export const resumeApi = {
  listMyResumes: async (query: MyResumesQuery = {}): Promise<MyResumesResponse> => {
    const res = await apiClient.get<
      ApiSuccessResponse<{ resumes: DashboardResumeItem[] }>
    >('/dashboard/resumes', { params: query });

    const meta = (res.data.meta ?? {}) as Partial<PageMeta>;
    return {
      resumes: res.data.data.resumes,
      meta: {
        page: meta.page ?? query.page ?? 1,
        limit: meta.limit ?? query.limit ?? 10,
        total: meta.total ?? res.data.data.resumes.length,
        totalPages: meta.totalPages ?? 1,
      },
    };
  },

  create: async (input: CreateResumeInput = {}): Promise<PublicResume> => {
    const res = await apiClient.post<ApiSuccessResponse<{ resume: PublicResume }>>(
      '/resumes',
      input
    );
    return res.data.data.resume;
  },

  getById: async (resumeId: string): Promise<PublicResume> => {
    const res = await apiClient.get<ApiSuccessResponse<{ resume: PublicResume }>>(
      `/resumes/${resumeId}`
    );
    return res.data.data.resume;
  },

  autoSave: async (
    resumeId: string,
    content: ResumeSnapshot
  ): Promise<{ resume: PublicResume; changed: boolean }> => {
    const res = await apiClient.post<
      ApiSuccessResponse<{ resume: PublicResume; changed: boolean }>
    >(`/resumes/${resumeId}/auto-save`, { content });
    return res.data.data;
  },
};
