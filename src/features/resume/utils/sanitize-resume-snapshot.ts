import type { ResumeSnapshot } from '@/features/resume/schemas/resume-snapshot-schema';

function omitInternalId<T extends object>(item: T): T {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = item as T & { id?: string };
  return rest as T;
}

export function sanitizeForSave(values: ResumeSnapshot): ResumeSnapshot {
  return {
    personalInfo: values.personalInfo ?? {},
    summary: values.summary ?? '',
    skills: (values.skills ?? []).map((s) => s.trim()).filter(Boolean),
    experience: (values.experience ?? []).map((item) => {
      const rest = omitInternalId(item);
      return {
        ...rest,
        highlights: (rest.highlights ?? []).map((h) => h.trim()).filter(Boolean),
      };
    }),
    education: (values.education ?? []).map(omitInternalId),
    projects: (values.projects ?? []).map((item) => {
      const rest = omitInternalId(item);
      return {
        ...rest,
        highlights: (rest.highlights ?? []).map((h) => h.trim()).filter(Boolean),
      };
    }),
    certifications: (values.certifications ?? []).map(omitInternalId),
    languages: (values.languages ?? [])
      .map(omitInternalId)
      .filter((l) => l.name?.trim()),
    socialLinks: (values.socialLinks ?? [])
      .map(omitInternalId)
      .filter((l) => l.url?.trim()),
  };
}
