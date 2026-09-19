export const tailoringKeys = {
  all: ['tailoring'] as const,
  job: (jobId: string) => [...tailoringKeys.all, 'job', jobId] as const,
  recent: (query: Record<string, unknown> = {}) =>
    [...tailoringKeys.all, 'recent', query] as const,
};
