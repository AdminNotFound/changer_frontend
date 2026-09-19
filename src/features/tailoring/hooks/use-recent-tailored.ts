'use client';

import { useQuery } from '@tanstack/react-query';
import type { RecentTailoredQuery } from '@/types/resume-tailoring';
import { tailoringApi } from '../api/tailoring-api';
import { tailoringKeys } from './tailoring-keys';

export function useRecentTailored(query: RecentTailoredQuery = {}) {
  return useQuery({
    queryKey: tailoringKeys.recent(query as Record<string, unknown>),
    queryFn: () => tailoringApi.listRecent(query),
    placeholderData: (previous) => previous,
  });
}
