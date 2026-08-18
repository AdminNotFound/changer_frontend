import { apiClient } from '@/lib/api/axios';
import { ApiSuccessResponse } from '@/types/api';
import {
  AuthResponseData,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResendVerificationRequest,
  ResetPasswordRequest,
  User,
} from '@/types/auth';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponseData> => {
    const res = await apiClient.post<ApiSuccessResponse<AuthResponseData>>(
      '/auth/login',
      data
    );
    return res.data.data;
  },

  register: async (data: RegisterRequest): Promise<{ user: User }> => {
    const res = await apiClient.post<ApiSuccessResponse<{ user: User }>>(
      '/auth/register',
      data
    );
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refresh: async (): Promise<AuthResponseData> => {
    const res = await apiClient.post<ApiSuccessResponse<AuthResponseData>>(
      '/auth/refresh',
      {}
    );
    return res.data.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await apiClient.get<ApiSuccessResponse<{ user: User }>>('/auth/me');
    return res.data.data.user;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post('/auth/forgot-password', data);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await apiClient.post('/auth/reset-password', data);
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.get('/auth/verify-email', {
      params: { token },
    });
  },

  resendVerification: async (data: ResendVerificationRequest): Promise<void> => {
    await apiClient.post('/auth/resend-verification', data);
  },
};
