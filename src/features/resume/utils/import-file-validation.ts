export const IMPORT_MAX_FILE_BYTES = 5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = ['.pdf', '.docx'] as const;

export type ImportFileValidationResult =
  | { valid: true }
  | { valid: false; message: string };

function getExtension(fileName: string): string {
  const idx = fileName.lastIndexOf('.');
  if (idx === -1) return '';
  return fileName.slice(idx).toLowerCase();
}

export function validateImportFile(file: File | null | undefined): ImportFileValidationResult {
  if (!file) {
    return { valid: false, message: 'Please select a file' };
  }

  if (file.size === 0) {
    return { valid: false, message: 'File is empty' };
  }

  if (file.size > IMPORT_MAX_FILE_BYTES) {
    return { valid: false, message: 'File must be 5 MB or less' };
  }

  const ext = getExtension(file.name);
  if (!ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
    return { valid: false, message: 'Only PDF and DOCX files are supported' };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
