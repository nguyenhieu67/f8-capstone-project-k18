import type { AxiosRequestConfig } from "axios";

// Body request chấp nhận object thường hoặc FormData
type RequestBody = Record<string, unknown> | FormData;

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

interface ApiI {
  get: <T>(endpoint: string, config?: AxiosRequestConfig) => Promise<T>;
  post: <T>(
    endpoint: string,
    body: RequestBody,
    config?: AxiosRequestConfig,
  ) => Promise<T>;
  put: <T>(
    endpoint: string,
    body: RequestBody,
    config?: AxiosRequestConfig,
  ) => Promise<T>;
  patch: <T>(
    endpoint: string,
    body: RequestBody,
    config?: AxiosRequestConfig,
  ) => Promise<T>;
  delete: <T>(endpoint: string, config?: AxiosRequestConfig) => Promise<T>;
}

// Type cho lỗi trả về từ backend
interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export type { RequestBody, HttpMethod, ApiI, ApiErrorResponse };
