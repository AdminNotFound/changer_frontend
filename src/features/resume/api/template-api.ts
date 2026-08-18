import { apiClient } from '@/lib/api/axios';
import { ApiSuccessResponse } from '@/types/api';
import type { PublicResume } from '@/types/resume';
import type { ChangeTemplateInput, TemplateSummary } from '@/types/resume-template';

export const templateApi = {
  listTemplates: async (): Promise<TemplateSummary[]> => {
    const res = await apiClient.get<
      ApiSuccessResponse<{ templates: TemplateSummary[] }>
    >('/templates');
    return res.data.data.templates;
  },

  changeTemplate: async (
    resumeId: string,
    input: ChangeTemplateInput
  ): Promise<PublicResume> => {
    const res = await apiClient.patch<ApiSuccessResponse<{ resume: PublicResume }>>(
      `/resumes/${resumeId}/template`,
      input
    );
    return res.data.data.resume;
  },
};
