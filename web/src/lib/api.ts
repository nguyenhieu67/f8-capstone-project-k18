import type { AxiosRequestConfig } from "axios";

import api from "@/lib/axios";
import type { ApiI, HttpMethod, RequestBody } from "@/types/api.types";

class Api implements ApiI {
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: RequestBody,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      if (method === "get" || method === "delete") {
        return await api[method](endpoint, config);
      }
      return await api[method](endpoint, body, config);
    } catch (e) {
      const error = e as { response?: { status?: number } };
      if (error?.response?.status !== 410) {
        console.error(`Lỗi API [${method.toUpperCase()}] ${endpoint}:`, e);
      }
      throw e;
    }
  }

  get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>("get", endpoint, undefined, config);
  }

  post<T>(
    endpoint: string,
    body: RequestBody,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>("post", endpoint, body, config);
  }

  put<T>(
    endpoint: string,
    body: RequestBody,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>("put", endpoint, body, config);
  }

  patch<T>(
    endpoint: string,
    body: RequestBody,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>("patch", endpoint, body, config);
  }

  delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>("delete", endpoint, undefined, config);
  }
}

export const fetchApi = new Api();
