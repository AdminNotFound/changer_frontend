import { apiClient } from '@/lib/api/axios';
import { ApiSuccessResponse } from '@/types/api';
import type { PageMeta } from '@/types/resume';
import type {
  RecentTailoredQuery,
  RecentTailoredResponse,
  TailorEnqueueInput,
  TailorEnqueueResult,
  TailorJobView,
} from '@/types/resume-tailoring';

const TAILOR_QUEUE = 'ai-tailoring';

export const tailoringApi = {
  enqueueTailor: async (
    resumeId: string,
    input: TailorEnqueueInput
  ): Promise<TailorEnqueueResult> => {
    const res = await apiClient.post<ApiSuccessResponse<TailorEnqueueResult>>(
      `/resumes/${resumeId}/tailor`,
      input
    );
    return res.data.data;
  },

  getJobStatus: async (jobId: string): Promise<TailorJobView> => {
    const res = await apiClient.get<ApiSuccessResponse<{ job: TailorJobView }>>(
      `/jobs/${jobId}`,
      { params: { queue: TAILOR_QUEUE } }
    );
    return res.data.data.job;
  },

  retryJob: async (jobId: string): Promise<TailorJobView> => {
    const res = await apiClient.post<ApiSuccessResponse<{ job: TailorJobView }>>(
      `/jobs/${jobId}/retry`,
      null,
      { params: { queue: TAILOR_QUEUE } }
    );
    return res.data.data.job;
  },

  listRecent: async (
    query: RecentTailoredQuery = {}
  ): Promise<RecentTailoredResponse> => {
    const res = await apiClient.get<
      ApiSuccessResponse<{ tailored: RecentTailoredResponse['tailored'] }>
    >('/dashboard/tailored/recent', { params: query });

    const meta = (res.data.meta ?? {}) as Partial<PageMeta>;
    return {
      tailored: res.data.data.tailored,
      meta: {
        page: meta.page ?? query.page ?? 1,
        limit: meta.limit ?? query.limit ?? 10,
        total: meta.total ?? res.data.data.tailored.length,
        totalPages: meta.totalPages ?? 1,
      },
    };
  },
};
