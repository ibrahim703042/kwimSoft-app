/**
 * Enhanced Axios Instance Configuration
 * Supports multiple services with automatic token refresh and error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, APP_CONFIG } from '@/config/index';

// Token storage keys
const TOKEN_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
} as const;

/**
 * Create axios instance for a specific service
 */
const createServiceInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: APP_CONFIG.api.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS);
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        originalRequest
      ) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH);
        if (refreshToken) {
          try {
            const response = await axios.post(
              `${API_CONFIG.userManagement.baseUrl}${API_CONFIG.userManagement.endpoints.auth}/refresh`,
              { refreshToken }
            );

            const newAccessToken = response.data.accessToken;
            localStorage.setItem(TOKEN_KEYS.ACCESS, newAccessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return instance(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            handleLogout();
            return Promise.reject(refreshError);
          }
        } else {
          handleLogout();
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Handle user logout
 */
const handleLogout = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Service-specific axios instances
 */
export const axiosInstances = {
  userManagement: createServiceInstance(API_CONFIG.userManagement.baseUrl),
  transport: createServiceInstance(API_CONFIG.transport.baseUrl),
  product: createServiceInstance(API_CONFIG.product.baseUrl),
  hr: createServiceInstance(API_CONFIG.hr.baseUrl),
  stock: createServiceInstance(API_CONFIG.stock.baseUrl),
  upload: createServiceInstance(API_CONFIG.upload.baseUrl),
  // Backward compat
  busManagement: createServiceInstance(API_CONFIG.transport.baseUrl),
  finance: createServiceInstance(API_CONFIG.stock.baseUrl),
  flightManagement: createServiceInstance(API_CONFIG.transport.baseUrl),
};

/**
 * Default axios instance (user management)
 */
export const axiosInstance = axiosInstances.userManagement;

/**
 * Helper function to get axios instance for a service
 */
export const getAxiosInstance = (
  service: keyof typeof axiosInstances
): AxiosInstance => {
  return axiosInstances[service];
};

/**
 * Generic API helper for any service
 */
const createApiHelper = (instance: AxiosInstance) => ({
  get: (url: string, config?: any) => instance.get(url, config),
  post: (url: string, data?: any, config?: any) => instance.post(url, data, config),
  put: (url: string, data?: any, config?: any) => instance.put(url, data, config),
  patch: (url: string, data?: any, config?: any) => instance.patch(url, data, config),
  delete: (url: string, config?: any) => instance.delete(url, config),
});

/**
 * API Helper Functions for all services
 */
export const api = {
  userManagement: createApiHelper(axiosInstances.userManagement),
  transport: createApiHelper(axiosInstances.transport),
  product: createApiHelper(axiosInstances.product),
  hr: createApiHelper(axiosInstances.hr),
  stock: createApiHelper(axiosInstances.stock),
  // Backward compat
  busManagement: createApiHelper(axiosInstances.transport),
  finance: createApiHelper(axiosInstances.stock),
  flightManagement: createApiHelper(axiosInstances.transport),
  upload: {
    post: (url: string, formData: FormData, config?: any) =>
      axiosInstances.upload.post(url, formData, {
        ...config,
        headers: { 'Content-Type': 'multipart/form-data', ...config?.headers },
      }),
  },
};

export default axiosInstance;
