import type { RecentActivityItem, RecentActivityType } from '@/types/resume';

const ACTIVITY_TYPES: RecentActivityType[] = [
  'resume_updated',
  'version_created',
  'ats_scored',
  'tailored',
  'cover_letter',
];

const ACTIVITY_LABELS: Record<RecentActivityType, string> = {
  resume_updated: 'Resume updated',
  version_created: 'Version created',
  ats_scored: 'ATS analysis',
  tailored: 'Resume tailored',
  cover_letter: 'Cover letter generated',
};

export function isRecentActivityType(type: string): type is RecentActivityType {
  return ACTIVITY_TYPES.includes(type as RecentActivityType);
}

export function formatActivityType(type: string): string {
  if (isRecentActivityType(type)) return ACTIVITY_LABELS[type];
  return type;
}

export function getActivityHref(item: RecentActivityItem): string | null {
  if (!item.resumeId) return null;

  switch (item.type) {
    case 'resume_updated':
    case 'version_created':
      return `/edit/${item.resumeId}`;
    case 'ats_scored':
      return '/ats';
    case 'tailored':
      return '/tailor';
    case 'cover_letter':
      return '/cover-letters';
    default:
      return null;
  }
}

export function formatAverageAtsScore(score: number | null | undefined): string {
  if (score == null) return '—';
  return score.toFixed(1);
}
