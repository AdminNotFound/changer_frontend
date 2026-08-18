'use client';

import React, { useCallback, useRef, useState } from 'react';
import { FileUp, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils/cn';
import {
  formatFileSize,
  validateImportFile,
} from '@/features/resume/utils/import-file-validation';

type ImportUploadStepProps = {
  onUpload: (file: File) => void;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
};

export function ImportUploadStep({
  onUpload,
  isUploading,
  uploadProgress,
  error,
}: ImportUploadStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;
    const result = validateImportFile(file);
    if (!result.valid) {
      setValidationError(result.message);
      setSelectedFile(null);
      return;
    }
    setValidationError(null);
    setSelectedFile(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const displayError = validationError ?? error;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Import resume
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload a PDF or DOCX file. We will extract your information so you can
          review it before creating a new resume.
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors cursor-pointer',
          isDragging
            ? 'border-purple-400 bg-purple-50/80'
            : 'border-gray-200 bg-white/50 hover:border-purple-300 hover:bg-purple-50/30',
          isUploading && 'pointer-events-none opacity-70'
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-4">
          <Upload className="h-7 w-7" />
        </div>
        <p className="text-sm font-semibold text-gray-900">
          Drag and drop your resume here
        </p>
        <p className="text-xs text-gray-500 mt-1">PDF or DOCX, up to 5 MB</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          disabled={isUploading}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Browse files
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          disabled={isUploading}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            handleFile(file);
            e.target.value = '';
          }}
        />
      </div>

      {selectedFile ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileUp className="h-5 w-5 shrink-0 text-purple-600" />
            <div className="min-w-0 text-left">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          {!isUploading ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0 px-2"
              onClick={() => {
                setSelectedFile(null);
                setValidationError(null);
              }}
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      ) : null}

      {isUploading ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Uploading…</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      ) : null}

      {displayError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {displayError}
        </div>
      ) : null}

      <Button
        type="button"
        className="w-full"
        disabled={!selectedFile || isUploading}
        onClick={() => selectedFile && onUpload(selectedFile)}
      >
        {isUploading ? 'Uploading…' : 'Upload and parse'}
      </Button>
    </div>
  );
}
