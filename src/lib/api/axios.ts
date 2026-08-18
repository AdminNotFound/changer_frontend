import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/auth-store';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';
import { AuthResponseData } from '@/types/auth';
import { ApiError } from './error';

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

const AUTH_NO_REFRESH_PATHS = [
  '/auth/login',
  '/auth/refresh',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/resend-verification',
];

const shouldSkipRefresh = (url?: string): boolean => {
  if (!url) return false;
  return AUTH_NO_REFRESH_PATHS.some((path) => url.includes(path));
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response) {
      return Promise.reject(
        new ApiError('Network error. Please check your connection.')
      );
    }

    const { status, data } = error.response;

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest.url)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post<
          ApiSuccessResponse<AuthResponseData>
        >(`${env.NEXT_PUBLIC_API_URL}/auth/refresh`, {}, { withCredentials: true });

        if (
          refreshResponse.data?.success &&
          refreshResponse.data.data?.accessToken
        ) {
          const { accessToken } = refreshResponse.data.data;
          useAuthStore.getState().setSession(accessToken);

          processQueue(null, accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        }

        useAuthStore.getState().clearSession();
        processQueue(new ApiError('Session expired. Please log in again.'));
        return Promise.reject(new ApiError('Session expired', 401));
      } catch (refreshErr) {
        useAuthStore.getState().clearSession();
        processQueue(refreshErr);
        return Promise.reject(
          new ApiError('Session expired. Please log in again.', 401)
        );
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(
      new ApiError(
        data?.message || error.message || 'An error occurred',
        status,
        data?.errors || [],
        data?.meta
      )
    );
  }
);
