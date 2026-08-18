import { apiClient } from '@/lib/api/axios';
import { ApiSuccessResponse } from '@/types/api';
import { DashboardStatistics } from '@/types/resume';

export const dashboardApi = {
  getStatistics: async (): Promise<DashboardStatistics> => {
    const res = await apiClient.get<
      ApiSuccessResponse<{ statistics: DashboardStatistics }>
    >('/dashboard/statistics');
    return res.data.data.statistics;
  },
};
