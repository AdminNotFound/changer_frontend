import { AxiosError } from 'axios';
import { ApiErrorResponse, ApiFieldError } from '@/types/api';

export class ApiError extends Error {
  public statusCode?: number;
  public errors: ApiFieldError[];
  public meta?: Record<string, unknown>;

  constructor(message: string, statusCode?: number, errors: ApiFieldError[] = [], meta?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.meta = meta;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ApiErrorResponse;
    if (data && data.success === false) {
      return new ApiError(
        data.message || 'An unexpected API error occurred',
        error.response.status,
        data.errors || [],
        data.meta
      );
    }
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('An unknown error occurred');
}
