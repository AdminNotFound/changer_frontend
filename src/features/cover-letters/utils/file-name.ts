export function coverLetterFileName(title: string): string {
  const base =
    title
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .slice(0, 80) || 'Cover-Letter';
  return `${base}.pdf`;
}
