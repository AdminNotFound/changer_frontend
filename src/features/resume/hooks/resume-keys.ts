export const resumeKeys = {
  all: ['resumes'] as const,
  lists: () => [...resumeKeys.all, 'list'] as const,
  list: (query: Record<string, unknown>) =>
    [...resumeKeys.lists(), query] as const,
  details: () => [...resumeKeys.all, 'detail'] as const,
  detail: (id: string) => [...resumeKeys.details(), id] as const,
  versions: (resumeId: string) =>
    [...resumeKeys.detail(resumeId), 'versions'] as const,
  version: (resumeId: string, versionId: string) =>
    [...resumeKeys.versions(resumeId), versionId] as const,
  compare: (resumeId: string, params: Record<string, unknown>) =>
    [...resumeKeys.versions(resumeId), 'compare', params] as const,
};

export const importKeys = {
  all: ['import'] as const,
  job: (jobId: string) => [...importKeys.all, 'job', jobId] as const,
};

export const dashboardKeys = {
  all: ['dashboard'] as const,
  statistics: () => [...dashboardKeys.all, 'statistics'] as const,
};
