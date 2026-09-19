'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { SafetyBanner } from '@/components/common/safety-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { handleApiError } from '@/lib/api/error';
import { isJobPollingStatus } from '@/lib/api/job-polling';
import { useUIStore } from '@/stores/ui-store';
import { dashboardKeys } from '@/features/dashboard/hooks/dashboard-keys';
import { resumeApi } from '@/features/resume/api/resume-api';
import { resumeKeys } from '@/features/resume/hooks/resume-keys';
import {
  normalizeResumeSnapshot,
  type ResumeSnapshot,
} from '@/features/resume/schemas/resume-snapshot-schema';
import {
  useEnqueueTailorMutation,
  useRetryTailorJobMutation,
  useTailorJobPolling,
} from '../hooks/use-tailor-resume';
import { tailoringKeys } from '../hooks/tailoring-keys';
import { TailorChanges } from './tailor-changes';
import { TailorCompare } from './tailor-compare';
import { TailorForm, type TailorFormSubmit } from './tailor-form';
import { TailorProcessing } from './tailor-processing';
import { TailorRecentList } from './tailor-recent-list';
import { TailorVersionBar } from './tailor-version-bar';

type Baseline = {
  resumeId: string;
  original: ResumeSnapshot;
  templateId: string;
  fromVersionNumber: number;
};

export function TailorResumePage() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const enqueue = useEnqueueTailorMutation();
  const retryJob = useRetryTailorJobMutation();

  const [jobId, setJobId] = useState<string | null>(null);
  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const [lastPayload, setLastPayload] = useState<TailorFormSubmit | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const handledJobRef = useRef<string | null>(null);

  const jobQuery = useTailorJobPolling(jobId);
  const job = jobQuery.data ?? null;
  const result = job?.status === 'completed' ? job.result : null;

  const isPolling = Boolean(job && isJobPollingStatus(job.status));
  const isBusy =
    isCapturing || enqueue.isPending || retryJob.isPending || isPolling;

  useEffect(() => {
    if (!job || job.status !== 'completed' || !job.result) return;
    if (handledJobRef.current === job.jobId) return;
    handledJobRef.current = job.jobId;

    const { resume } = job.result;
    queryClient.setQueryData(resumeKeys.detail(resume.id), resume);
    void queryClient.invalidateQueries({ queryKey: resumeKeys.versions(resume.id) });
    void queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    void queryClient.invalidateQueries({ queryKey: dashboardKeys.statistics() });
    void queryClient.invalidateQueries({ queryKey: tailoringKeys.all });
    addToast({ type: 'success', message: 'Resume tailored' });
  }, [job, queryClient, addToast]);

  const startTailor = async (payload: TailorFormSubmit) => {
    setCaptureError(null);
    setLastPayload(payload);
    setJobId(null);
    setIsCapturing(true);
    try {
      const resume = await queryClient.fetchQuery({
        queryKey: resumeKeys.detail(payload.resumeId),
        queryFn: () => resumeApi.getById(payload.resumeId),
      });
      setBaseline({
        resumeId: resume.id,
        original: normalizeResumeSnapshot(resume.draft),
        templateId: resume.templateId,
        fromVersionNumber: resume.currentVersionNumber,
      });
      handledJobRef.current = null;
      const enqueued = await enqueue.mutateAsync({
        resumeId: payload.resumeId,
        input: payload.input,
      });
      setJobId(enqueued.jobId);
    } catch (error) {
      const message = handleApiError(error).message;
      setCaptureError(message);
      addToast({ type: 'error', message });
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetry = async () => {
    if (jobId && job?.status === 'failed') {
      try {
        await retryJob.mutateAsync(jobId);
        return;
      } catch {
        // Re-enqueue if the job cannot be retried.
      }
    }
    if (lastPayload) {
      await startTailor(lastPayload);
    }
  };

  const enqueueError = enqueue.isError ? handleApiError(enqueue.error).message : null;
  const pollError = jobQuery.isError ? handleApiError(jobQuery.error).message : null;
  const failedReason = job?.status === 'failed' ? job.failedReason : null;
  const errorMessage = captureError ?? enqueueError ?? pollError ?? failedReason;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Tailor Resume</h2>
        <p className="mt-1 text-sm text-gray-500">
          Rewrite a saved draft for a specific job. The backend runs the AI and stores a new
          version — nothing is generated in the browser.
        </p>
      </div>

      <SafetyBanner description="Tailoring only rewrites existing content. It will not add companies, jobs, education, or certifications that were not already on your resume. Review the result before you use it." />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_1fr]">
        <div className="space-y-6">
          <TailorForm onSubmit={(payload) => void startTailor(payload)} isSubmitting={isBusy} />
          <TailorRecentList />
        </div>

        <div className="space-y-4">
          {isBusy ? (
            <TailorProcessing />
          ) : errorMessage && !result ? (
            <Card className="border-red-100 bg-red-50/60">
              <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-3 pt-6 text-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <p className="font-semibold text-red-800">Couldn’t tailor resume</p>
                <p className="max-w-md text-sm text-red-600">{errorMessage}</p>
                {lastPayload ? (
                  <Button type="button" variant="outline" onClick={() => void handleRetry()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ) : result && baseline ? (
            <>
              <TailorVersionBar
                resumeId={baseline.resumeId}
                version={result.version}
                versionCreated={result.versionCreated}
                fromVersionNumber={baseline.fromVersionNumber}
              />
              <TailorChanges
                changedSections={result.changedSections}
                addedKeywords={result.addedKeywords}
                missingKeywords={result.missingKeywords}
              />
              <TailorCompare
                original={baseline.original}
                tailored={result.tailoredResume}
                templateId={baseline.templateId}
                changedSections={result.changedSections}
              />
            </>
          ) : (
            <Card>
              <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-2 pt-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className="font-semibold text-gray-900">No tailored result yet</p>
                <p className="max-w-sm text-sm text-gray-500">
                  Select a resume, paste a job description, and start tailoring to review the
                  before and after.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
