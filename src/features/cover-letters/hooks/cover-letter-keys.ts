export const coverLetterKeys = {
  all: ['coverLetters'] as const,
  lists: () => [...coverLetterKeys.all, 'list'] as const,
  list: (query: Record<string, unknown> = {}) =>
    [...coverLetterKeys.lists(), query] as const,
  details: () => [...coverLetterKeys.all, 'detail'] as const,
  detail: (resumeId: string, coverLetterId: string) =>
    [...coverLetterKeys.details(), resumeId, coverLetterId] as const,
  job: (jobId: string) => [...coverLetterKeys.all, 'job', jobId] as const,
};
