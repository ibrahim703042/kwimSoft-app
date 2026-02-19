import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getSubdomainInfo } from './subdomain';

/**
 * Create an axios instance with subdomain context
 * Automatically adds subdomain to requests when available
 */
export function createApiClient(baseURL?: string): AxiosInstance {
  const client = axios.create({
    baseURL: baseURL || import.meta.env.VITE_API_HOST,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add subdomain context
  client.interceptors.request.use(
    (config) => {
      const { subdomain } = getSubdomainInfo();
      
      // Add subdomain to headers if available
      if (subdomain) {
        config.headers['X-Tenant-Subdomain'] = subdomain;
      }

      // Add auth token if available
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized - token expired
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh token
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            const response = await axios.post(
              `${import.meta.env.VITE_API_HOST}/api/auth/refresh`,
              { refreshToken }
            );

            const { accessToken } = response.data;
            localStorage.setItem('access_token', accessToken);

            // Retry original request with new token
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

/**
 * Default API client instance
 */
export const apiClient = createApiClient();

/**
 * API helper functions
 */
export const api = {
  /**
   * GET request
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return apiClient.get<T>(url, config);
  },

  /**
   * POST request
   */
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return apiClient.post<T>(url, data, config);
  },

  /**
   * PUT request
   */
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return apiClient.put<T>(url, data, config);
  },

  /**
   * PATCH request
   */
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return apiClient.patch<T>(url, data, config);
  },

  /**
   * DELETE request
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return apiClient.delete<T>(url, config);
  },
};

/**
 * Enterprise-specific API calls
 */
export const enterpriseApi = {
  /**
   * Check if subdomain is available
   */
  checkSubdomain: async (subdomain: string) => {
    const response = await api.get(`/api/enterprises/check-subdomain/${subdomain}`);
    return response.data;
  },

  /**
   * Create new enterprise
   */
  createEnterprise: async (data: {
    name: string;
    subdomain: string;
    admin: {
      name: string;
      email: string;
      password: string;
    };
  }) => {
    const response = await api.post('/api/enterprises/create', data);
    return response.data;
  },

  /**
   * Get enterprise by subdomain
   */
  getBySubdomain: async (subdomain: string) => {
    const response = await api.get(`/api/enterprises/by-subdomain/${subdomain}`);
    return response.data;
  },

  /**
   * Get current enterprise info
   */
  getCurrent: async () => {
    const { subdomain } = getSubdomainInfo();
    if (!subdomain) {
      throw new Error('No subdomain context available');
    }
    return enterpriseApi.getBySubdomain(subdomain);
  },
};

/**
 * Auth API calls with subdomain context
 */
export const authApi = {
  /**
   * Login with subdomain context
   */
  login: async (credentials: { username: string; password: string }) => {
    const { subdomain } = getSubdomainInfo();
    const response = await api.post('/api/auth/login', {
      ...credentials,
      subdomain,
    });
    return response.data;
  },

  /**
   * Logout
   */
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    return response.data;
  },

  /**
   * Refresh token
   */
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/api/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email: string) => {
    const { subdomain } = getSubdomainInfo();
    const response = await api.post('/api/auth/forgot-password', {
      email,
      subdomain,
    });
    return response.data;
  },

  /**
   * Reset password
   */
  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post('/api/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },
};

export default api;
