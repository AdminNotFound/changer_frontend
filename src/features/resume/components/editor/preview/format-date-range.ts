import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';

export function formatDateRange(
  start?: string,
  end?: string,
  current?: boolean
): string {
  const startLabel = start?.trim() || '';
  const endLabel = current ? 'Present' : end?.trim() || '';
  if (!startLabel && !endLabel) return '';
  if (!startLabel) return endLabel;
  if (!endLabel) return startLabel;
  return `${startLabel} – ${endLabel}`;
}

export function contactLine(snapshot: ResumeSnapshot): string {
  const info = snapshot.personalInfo ?? {};
  const parts = [
    info.email,
    info.phone,
    info.location,
    info.website,
    info.linkedin,
    info.github,
  ].filter((value): value is string => Boolean(value && value.trim()));

  const social = (snapshot.socialLinks ?? [])
    .map((link) => link.url)
    .filter((url): url is string => Boolean(url && url.trim()));

  return [...parts, ...social].join('  |  ');
}
