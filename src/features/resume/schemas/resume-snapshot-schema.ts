import { z } from 'zod';

export const personalInfoSchema = z.object({
  fullName: z.string().optional(),
  email: z.union([z.string().email('Enter a valid email'), z.literal('')]).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
});

export const experienceItemSchema = z.object({
  company: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

export const educationItemSchema = z.object({
  institution: z.string().optional(),
  degree: z.string().optional(),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const projectItemSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

export const certificationItemSchema = z.object({
  name: z.string().optional(),
  issuer: z.string().optional(),
  date: z.string().optional(),
  url: z.string().optional(),
});

export const languageItemSchema = z.object({
  name: z.string().min(1, 'Language name is required'),
  proficiency: z.string().optional(),
});

export const socialLinkSchema = z.object({
  label: z.string().optional(),
  url: z.string().min(1, 'URL is required'),
});

export const resumeSnapshotSchema = z.object({
  personalInfo: personalInfoSchema.optional(),
  summary: z.string().optional(),
  experience: z.array(experienceItemSchema).optional(),
  education: z.array(educationItemSchema).optional(),
  skills: z.array(z.string()).optional(),
  projects: z.array(projectItemSchema).optional(),
  certifications: z.array(certificationItemSchema).optional(),
  languages: z.array(languageItemSchema).optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type CertificationItem = z.infer<typeof certificationItemSchema>;
export type LanguageItem = z.infer<typeof languageItemSchema>;
export type SocialLinkItem = z.infer<typeof socialLinkSchema>;
export type ResumeSnapshot = z.infer<typeof resumeSnapshotSchema>;

export const emptyResumeSnapshot = (): ResumeSnapshot => ({
  personalInfo: {},
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  socialLinks: [],
});

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === 'string' ? item : String(item ?? '')));
}

function asObjectArray<T>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item && typeof item === 'object') as T[];
}

export function normalizeResumeSnapshot(raw: unknown): ResumeSnapshot {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const personalInfo =
    data.personalInfo && typeof data.personalInfo === 'object'
      ? (data.personalInfo as PersonalInfo)
      : {};

  return {
    personalInfo,
    summary: typeof data.summary === 'string' ? data.summary : '',
    skills: asStringArray(data.skills),
    experience: asObjectArray<ExperienceItem>(data.experience).map((item) => ({
      ...item,
      highlights: asStringArray(item.highlights),
    })),
    education: asObjectArray<EducationItem>(data.education),
    projects: asObjectArray<ProjectItem>(data.projects).map((item) => ({
      ...item,
      highlights: asStringArray(item.highlights),
    })),
    certifications: asObjectArray<CertificationItem>(data.certifications),
    languages: asObjectArray<LanguageItem>(data.languages),
    socialLinks: asObjectArray<SocialLinkItem>(data.socialLinks),
  };
}
