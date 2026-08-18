'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleApiError } from '@/lib/api/error';
import type { ImportPreviewResult } from '@/types/resume-import';
import {
  useImportJobPolling,
  useImportPreviewMutation,
} from '@/features/resume/hooks/use-resume-import';
import { ImportUploadStep } from './import-upload-step';
import { ImportParsingStep } from './import-parsing-step';
import { ImportReviewStep } from './import-review-step';

type ImportStep = 'upload' | 'parsing' | 'review';

export function ImportResumePage() {
  const [step, setStep] = useState<ImportStep>('upload');
  const [fileName, setFileName] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const previewMutation = useImportPreviewMutation();
  const jobQuery = useImportJobPolling(jobId, step === 'parsing');

  const job = jobQuery.data;
  const completedResult =
    job?.status === 'completed' && job.result
      ? (job.result as ImportPreviewResult)
      : null;

  const parseError =
    job?.status === 'failed'
      ? job.failedReason ||
        'Failed to parse resume file. Please try another file.'
      : jobQuery.isError
        ? handleApiError(jobQuery.error).message
        : null;

  const showReview = step === 'review' || (step === 'parsing' && completedResult);
  const reviewData = completedResult;

  const resetFlow = () => {
    setStep('upload');
    setFileName('');
    setJobId(null);
    setUploadProgress(0);
    setUploadError(null);
  };

  const handleUpload = async (file: File) => {
    setUploadError(null);
    setFileName(file.name);
    setUploadProgress(0);

    try {
      const result = await previewMutation.mutateAsync({
        file,
        onUploadProgress: setUploadProgress,
      });
      setJobId(result.jobId);
      setStep('parsing');
    } catch (err) {
      setUploadError(handleApiError(err).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
          <Link href="/resumes">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to My Resumes
          </Link>
        </Button>
      </div>

      {step === 'upload' ? (
        <ImportUploadStep
          onUpload={(file) => void handleUpload(file)}
          isUploading={previewMutation.isPending}
          uploadProgress={uploadProgress}
          error={uploadError}
        />
      ) : null}

      {step === 'parsing' && !showReview ? (
        <ImportParsingStep
          fileName={fileName}
          status={job?.status ?? null}
          error={parseError}
          onRetry={resetFlow}
        />
      ) : null}

      {showReview && reviewData ? (
        <ImportReviewStep
          extracted={reviewData.extracted}
          meta={reviewData.meta}
          onBack={resetFlow}
        />
      ) : null}
    </div>
  );
}
