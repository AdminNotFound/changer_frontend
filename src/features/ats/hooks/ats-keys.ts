export const atsKeys = {
  all: ['ats'] as const,
  history: (query: Record<string, unknown> = {}) =>
    [...atsKeys.all, 'history', query] as const,
};
