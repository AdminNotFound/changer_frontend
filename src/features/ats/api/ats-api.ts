import { apiClient } from '@/lib/api/axios';
import { ApiSuccessResponse } from '@/types/api';
import type { PageMeta } from '@/types/resume';
import type {
  AtsHistoryQuery,
  AtsHistoryResponse,
  AtsScoreInput,
  AtsScoreResult,
} from '@/types/ats';

export const atsApi = {
  score: async (input: AtsScoreInput): Promise<AtsScoreResult> => {
    const res = await apiClient.post<ApiSuccessResponse<AtsScoreResult>>(
      '/ats/score',
      input
    );
    return res.data.data;
  },

  listRecent: async (query: AtsHistoryQuery = {}): Promise<AtsHistoryResponse> => {
    const res = await apiClient.get<
      ApiSuccessResponse<{ atsScores: AtsHistoryResponse['atsScores'] }>
    >('/dashboard/ats-scores/recent', { params: query });

    const meta = (res.data.meta ?? {}) as Partial<PageMeta>;
    return {
      atsScores: res.data.data.atsScores,
      meta: {
        page: meta.page ?? query.page ?? 1,
        limit: meta.limit ?? query.limit ?? 10,
        total: meta.total ?? res.data.data.atsScores.length,
        totalPages: meta.totalPages ?? 1,
      },
    };
  },
};
