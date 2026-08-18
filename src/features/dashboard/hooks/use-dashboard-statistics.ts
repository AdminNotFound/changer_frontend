'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard-api';
import { dashboardKeys } from '@/features/resume/hooks/resume-keys';

export function useDashboardStatistics() {
  return useQuery({
    queryKey: dashboardKeys.statistics(),
    queryFn: dashboardApi.getStatistics,
  });
}
