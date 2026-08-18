import { apiClient } from '@/lib/api/axios';
import { ApiSuccessResponse } from '@/types/api';
import type {
  PublicVersion,
  RestoreVersionResult,
  VersionCompareParams,
  VersionCompareResult,
  VersionHistoryItem,
} from '@/types/resume-version';

export const versionApi = {
  list: async (resumeId: string): Promise<VersionHistoryItem[]> => {
    const res = await apiClient.get<
      ApiSuccessResponse<{ versions: VersionHistoryItem[] }>
    >(`/resumes/${resumeId}/versions`);
    return res.data.data.versions;
  },

  getById: async (resumeId: string, versionId: string): Promise<PublicVersion> => {
    const res = await apiClient.get<ApiSuccessResponse<{ version: PublicVersion }>>(
      `/resumes/${resumeId}/versions/${versionId}`
    );
    return res.data.data.version;
  },

  compare: async (
    resumeId: string,
    params: VersionCompareParams
  ): Promise<VersionCompareResult> => {
    const res = await apiClient.get<ApiSuccessResponse<VersionCompareResult>>(
      `/resumes/${resumeId}/versions/compare`,
      { params }
    );
    return res.data.data;
  },

  restore: async (resumeId: string, versionId: string): Promise<RestoreVersionResult> => {
    const res = await apiClient.post<ApiSuccessResponse<RestoreVersionResult>>(
      `/resumes/${resumeId}/versions/${versionId}/restore`
    );
    return res.data.data;
  },

  delete: async (resumeId: string, versionId: string): Promise<void> => {
    await apiClient.delete(`/resumes/${resumeId}/versions/${versionId}`);
  },
};
