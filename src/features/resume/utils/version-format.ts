export function formatVersionDate(value: string | null): string {
  if (!value) return 'Unknown date';
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function formatDiffValue(value: unknown): string {
  if (value === undefined || value === null) return '—';
  if (typeof value === 'string') return value || '—';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}
