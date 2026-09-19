'use client';

import { useQuery } from '@tanstack/react-query';
import type { AtsHistoryQuery } from '@/types/ats';
import { atsApi } from '../api/ats-api';
import { atsKeys } from './ats-keys';

export function useAtsHistory(query: AtsHistoryQuery = {}) {
  return useQuery({
    queryKey: atsKeys.history(query as Record<string, unknown>),
    queryFn: () => atsApi.listRecent(query),
    placeholderData: (previous) => previous,
  });
}
