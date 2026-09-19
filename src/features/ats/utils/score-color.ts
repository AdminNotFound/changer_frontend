export type ScoreBand = 'low' | 'mid' | 'high';

export function getScoreBand(score: number): ScoreBand {
  if (score < 50) return 'low';
  if (score < 75) return 'mid';
  return 'high';
}

export function getScoreStroke(score: number): string {
  const band = getScoreBand(score);
  if (band === 'low') return '#dc2626';
  if (band === 'mid') return '#d97706';
  return '#7c3aed';
}

export function getScoreTextClass(score: number): string {
  const band = getScoreBand(score);
  if (band === 'low') return 'text-red-600';
  if (band === 'mid') return 'text-amber-600';
  return 'text-purple-700';
}

export function getScoreLabel(score: number): string {
  const band = getScoreBand(score);
  if (band === 'low') return 'Needs work';
  if (band === 'mid') return 'Good match';
  return 'Strong match';
}
