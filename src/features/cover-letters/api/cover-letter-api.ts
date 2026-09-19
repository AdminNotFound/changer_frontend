import { apiClient } from '@/lib/api/axios';
import { ApiSuccessResponse } from '@/types/api';
import type { PageMeta } from '@/types/resume';
import type {
  CoverLetterEnqueueResult,
  CoverLetterJobView,
  CoverLettersQuery,
  CoverLettersResponse,
  GenerateCoverLetterInput,
  PublicCoverLetter,
  RegenerateCoverLetterInput,
  SaveCoverLetterInput,
} from '@/types/cover-letter';

export const COVER_LETTER_QUEUE = 'cover-letter';

export const coverLetterApi = {
  generate: async (
    resumeId: string,
    input: GenerateCoverLetterInput
  ): Promise<CoverLetterEnqueueResult> => {
    const res = await apiClient.post<ApiSuccessResponse<CoverLetterEnqueueResult>>(
      `/resumes/${resumeId}/cover-letters`,
      input
    );
    return res.data.data;
  },

  list: async (query: CoverLettersQuery = {}): Promise<CoverLettersResponse> => {
    const res = await apiClient.get<
      ApiSuccessResponse<{ coverLetters: CoverLettersResponse['coverLetters'] }>
    >('/dashboard/cover-letters', { params: query });

    const meta = (res.data.meta ?? {}) as Partial<PageMeta>;
    return {
      coverLetters: res.data.data.coverLetters,
      meta: {
        page: meta.page ?? query.page ?? 1,
        limit: meta.limit ?? query.limit ?? 10,
        total: meta.total ?? res.data.data.coverLetters.length,
        totalPages: meta.totalPages ?? 1,
      },
    };
  },

  getById: async (resumeId: string, coverLetterId: string): Promise<PublicCoverLetter> => {
    const res = await apiClient.get<ApiSuccessResponse<{ coverLetter: PublicCoverLetter }>>(
      `/resumes/${resumeId}/cover-letters/${coverLetterId}`
    );
    return res.data.data.coverLetter;
  },

  save: async (
    resumeId: string,
    coverLetterId: string,
    input: SaveCoverLetterInput
  ): Promise<PublicCoverLetter> => {
    const res = await apiClient.patch<ApiSuccessResponse<{ coverLetter: PublicCoverLetter }>>(
      `/resumes/${resumeId}/cover-letters/${coverLetterId}`,
      input
    );
    return res.data.data.coverLetter;
  },

  regenerate: async (
    resumeId: string,
    coverLetterId: string,
    input: RegenerateCoverLetterInput = {}
  ): Promise<CoverLetterEnqueueResult> => {
    const res = await apiClient.post<ApiSuccessResponse<CoverLetterEnqueueResult>>(
      `/resumes/${resumeId}/cover-letters/${coverLetterId}/regenerate`,
      input
    );
    return res.data.data;
  },

  remove: async (resumeId: string, coverLetterId: string): Promise<void> => {
    await apiClient.delete(`/resumes/${resumeId}/cover-letters/${coverLetterId}`);
  },

  download: async (resumeId: string, coverLetterId: string): Promise<Blob> => {
    const res = await apiClient.get<Blob>(
      `/resumes/${resumeId}/cover-letters/${coverLetterId}/download`,
      { responseType: 'blob' }
    );
    return res.data;
  },

  getJobStatus: async (jobId: string): Promise<CoverLetterJobView> => {
    const res = await apiClient.get<ApiSuccessResponse<{ job: CoverLetterJobView }>>(
      `/jobs/${jobId}`,
      { params: { queue: COVER_LETTER_QUEUE } }
    );
    return res.data.data.job;
  },

  retryJob: async (jobId: string): Promise<CoverLetterJobView> => {
    const res = await apiClient.post<ApiSuccessResponse<{ job: CoverLetterJobView }>>(
      `/jobs/${jobId}/retry`,
      null,
      { params: { queue: COVER_LETTER_QUEUE } }
    );
    return res.data.data.job;
  },
};
