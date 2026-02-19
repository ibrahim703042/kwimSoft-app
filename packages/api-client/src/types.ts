import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface ApiClientConfig extends AxiosRequestConfig {
  skipTenantHeaders?: boolean;
}

export interface ApiClient {
  get<T = any>(url: string, config?: ApiClientConfig): Promise<AxiosResponse<T>>;
  post<T = any>(url: string, data?: any, config?: ApiClientConfig): Promise<AxiosResponse<T>>;
  put<T = any>(url: string, data?: any, config?: ApiClientConfig): Promise<AxiosResponse<T>>;
  patch<T = any>(url: string, data?: any, config?: ApiClientConfig): Promise<AxiosResponse<T>>;
  delete<T = any>(url: string, config?: ApiClientConfig): Promise<AxiosResponse<T>>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}
