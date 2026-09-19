'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '@/stores/ui-store';
import type { AtsScoreInput } from '@/types/ats';
import { dashboardKeys } from '@/features/dashboard/hooks/dashboard-keys';
import { atsApi } from '../api/ats-api';
import { atsKeys } from './ats-keys';

export function useScoreAtsMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: (input: AtsScoreInput) => atsApi.score(input),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: atsKeys.all });
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.statistics() });
      addToast({
        type: 'success',
        message: `ATS score calculated: ${result.overallScore}`,
      });
    },
  });
}
