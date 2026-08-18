import { apiClient } from '@/lib/api/axios';
import { ApiSuccessResponse } from '@/types/api';
import type {
  PdfEnqueueResult,
  PdfJobView,
  PdfSource,
} from '@/types/resume-pdf';

const PDF_QUEUE = 'pdf-generation';

export const pdfApi = {
  enqueueGenerate: async (
    resumeId: string,
    source?: PdfSource
  ): Promise<PdfEnqueueResult> => {
    const res = await apiClient.post<ApiSuccessResponse<PdfEnqueueResult>>(
      `/resumes/${resumeId}/pdf/generate`,
      null,
      { params: source ? { source } : undefined }
    );
    return res.data.data;
  },

  enqueuePreview: async (
    resumeId: string,
    source?: PdfSource
  ): Promise<PdfEnqueueResult> => {
    const res = await apiClient.get<ApiSuccessResponse<PdfEnqueueResult>>(
      `/resumes/${resumeId}/pdf/preview`,
      { params: source ? { source } : undefined }
    );
    return res.data.data;
  },

  enqueueDownload: async (
    resumeId: string,
    source?: PdfSource
  ): Promise<PdfEnqueueResult> => {
    const res = await apiClient.get<ApiSuccessResponse<PdfEnqueueResult>>(
      `/resumes/${resumeId}/pdf/download`,
      { params: source ? { source } : undefined }
    );
    return res.data.data;
  },

  getJobStatus: async (jobId: string): Promise<PdfJobView> => {
    const res = await apiClient.get<ApiSuccessResponse<{ job: PdfJobView }>>(
      `/jobs/${jobId}`,
      { params: { queue: PDF_QUEUE } }
    );
    return res.data.data.job;
  },

  downloadJobPdf: async (jobId: string): Promise<Blob> => {
    const res = await apiClient.get<Blob>(`/jobs/${jobId}/download`, {
      params: { queue: PDF_QUEUE },
      responseType: 'blob',
    });
    return res.data;
  },
};
