import type { PageMeta } from '@/types/resume';

export type AtsScoreSource = 'draft' | 'published';

export type SectionScores = {
  skills: number;
  experience: number;
  projects: number;
  education: number;
  tools: number;
};

export type ScoreWeights = SectionScores;

export type ScoreBreakdown = {
  weights: ScoreWeights;
  weightedScores: SectionScores;
  matchedCount: number;
  missingCount: number;
  totalKeywords: number;
};

export type AtsScoreResult = {
  overallScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  sectionScores: SectionScores;
  keywordDensity: number;
  scoreBreakdown: ScoreBreakdown;
};

export type AtsScoreInput = {
  jobDescription: string;
  resumeId: string;
  source?: AtsScoreSource;
};

export type AtsHistoryItem = {
  id: string;
  resumeId: string;
  resumeTitle: string;
  overallScore: number;
  matchedCount: number;
  missingCount: number;
  createdAt: string;
};

export type AtsHistorySortBy = 'createdAt' | 'overallScore';

export type AtsHistoryQuery = {
  page?: number;
  limit?: number;
  q?: string;
  resumeId?: string;
  sortBy?: AtsHistorySortBy;
  sortOrder?: 'asc' | 'desc';
};

export type AtsHistoryResponse = {
  atsScores: AtsHistoryItem[];
  meta: PageMeta;
};
