export const dashboardKeys = {
  all: ['dashboard'] as const,
  statistics: () => [...dashboardKeys.all, 'statistics'] as const,
};
