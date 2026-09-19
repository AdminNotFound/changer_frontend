'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard-api';
import { dashboardKeys } from './dashboard-keys';

export function useDashboardStatistics() {
  return useQuery({
    queryKey: dashboardKeys.statistics(),
    queryFn: dashboardApi.getStatistics,
  });
}
