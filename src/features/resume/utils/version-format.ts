export { formatVersionDate } from '@/lib/utils/date-format';

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
