import type { AxiosProgressEvent } from 'axios';
import { apiClient } from '@/lib/api/axios';
import { ApiSuccessResponse } from '@/types/api';
import type {
  ImportConfirmInput,
  ImportConfirmResult,
  ImportJobView,
  ImportPreviewEnqueueResult,
} from '@/types/resume-import';

const RESUME_PARSING_QUEUE = 'resume-parsing';

export const importApi = {
  previewUpload: async (
    file: File,
    onUploadProgress?: (percent: number) => void
  ): Promise<ImportPreviewEnqueueResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post<
      ApiSuccessResponse<ImportPreviewEnqueueResult>
    >('/resumes/import/preview', formData, {
      onUploadProgress: (event: AxiosProgressEvent) => {
        if (!event.total) return;
        const percent = Math.round((event.loaded * 100) / event.total);
        onUploadProgress?.(percent);
      },
    });

    return res.data.data;
  },

  getJobStatus: async (jobId: string): Promise<ImportJobView> => {
    const res = await apiClient.get<ApiSuccessResponse<{ job: ImportJobView }>>(
      `/jobs/${jobId}`,
      { params: { queue: RESUME_PARSING_QUEUE } }
    );
    return res.data.data.job;
  },

  confirmImport: async (input: ImportConfirmInput): Promise<ImportConfirmResult> => {
    const res = await apiClient.post<ApiSuccessResponse<ImportConfirmResult>>(
      '/resumes/import',
      input
    );
    return res.data.data;
  },
};
