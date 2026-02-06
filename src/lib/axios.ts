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

      // Handle 401 errors (token expired)
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        originalRequest
      ) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH);
        if (refreshToken) {
          try {
            // Attempt to refresh token
            const response = await axios.post(
              `${API_CONFIG.userManagement.baseUrl}/api/token/refresh/`,
              { refresh: refreshToken }
            );

            const newAccessToken = response.data.access;
            localStorage.setItem(TOKEN_KEYS.ACCESS, newAccessToken);

            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return instance(originalRequest);
          } catch (refreshError) {
            // Refresh failed - logout user
            console.error('Token refresh failed:', refreshError);
            handleLogout();
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token - logout user
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
  window.location.href = '/login';
};

/**
 * Service-specific axios instances
 */
export const axiosInstances = {
  userManagement: createServiceInstance(API_CONFIG.userManagement.baseUrl),
  busManagement: createServiceInstance(API_CONFIG.busManagement.baseUrl),
  finance: createServiceInstance(API_CONFIG.finance.baseUrl),
  flightManagement: createServiceInstance(API_CONFIG.flightManagement.baseUrl),
  upload: createServiceInstance(API_CONFIG.upload.baseUrl),
};

/**
 * Default axios instance (user management for backward compatibility)
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
 * API Helper Functions
 */
export const api = {
  // User Management
  userManagement: {
    get: (url: string, config?: any) =>
      axiosInstances.userManagement.get(url, config),
    post: (url: string, data?: any, config?: any) =>
      axiosInstances.userManagement.post(url, data, config),
    put: (url: string, data?: any, config?: any) =>
      axiosInstances.userManagement.put(url, data, config),
    delete: (url: string, config?: any) =>
      axiosInstances.userManagement.delete(url, config),
    patch: (url: string, data?: any, config?: any) =>
      axiosInstances.userManagement.patch(url, data, config),
  },

  // Bus Management
  busManagement: {
    get: (url: string, config?: any) =>
      axiosInstances.busManagement.get(url, config),
    post: (url: string, data?: any, config?: any) =>
      axiosInstances.busManagement.post(url, data, config),
    put: (url: string, data?: any, config?: any) =>
      axiosInstances.busManagement.put(url, data, config),
    delete: (url: string, config?: any) =>
      axiosInstances.busManagement.delete(url, config),
    patch: (url: string, data?: any, config?: any) =>
      axiosInstances.busManagement.patch(url, data, config),
  },

  // Finance
  finance: {
    get: (url: string, config?: any) => axiosInstances.finance.get(url, config),
    post: (url: string, data?: any, config?: any) =>
      axiosInstances.finance.post(url, data, config),
    put: (url: string, data?: any, config?: any) =>
      axiosInstances.finance.put(url, data, config),
    delete: (url: string, config?: any) =>
      axiosInstances.finance.delete(url, config),
    patch: (url: string, data?: any, config?: any) =>
      axiosInstances.finance.patch(url, data, config),
  },

  // Flight Management
  flightManagement: {
    get: (url: string, config?: any) =>
      axiosInstances.flightManagement.get(url, config),
    post: (url: string, data?: any, config?: any) =>
      axiosInstances.flightManagement.post(url, data, config),
    put: (url: string, data?: any, config?: any) =>
      axiosInstances.flightManagement.put(url, data, config),
    delete: (url: string, config?: any) =>
      axiosInstances.flightManagement.delete(url, config),
    patch: (url: string, data?: any, config?: any) =>
      axiosInstances.flightManagement.patch(url, data, config),
  },

  // Upload
  upload: {
    post: (url: string, formData: FormData, config?: any) =>
      axiosInstances.upload.post(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      }),
  },
};

export default axiosInstance;
