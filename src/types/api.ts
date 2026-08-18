export type ApiSuccessResponse<T = unknown> = {
  success: true;
  message: string;
  data: T;
  meta: Record<string, unknown>;
};

export type ApiFieldError = {
  path: string;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors: ApiFieldError[];
  meta?: Record<string, unknown>;
};

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
