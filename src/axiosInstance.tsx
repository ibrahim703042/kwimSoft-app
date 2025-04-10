import axios from 'axios';
import { API_ROUTE } from '../config';

// Token management utilities
interface TokenManagerInterface {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setAccessToken: (token: string) => void;
  clearTokens: () => void;
  redirectToLogin: () => void;
}

const TokenManager: TokenManagerInterface = {
  getAccessToken: (): string | null => localStorage.getItem('access_token'),
  getRefreshToken: (): string | null => localStorage.getItem('refresh_token'),
  setAccessToken: (token: string): void => localStorage.setItem('access_token', token),
  clearTokens: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  redirectToLogin: (): void => {
    window.location.href = '/login';
  }
};

// Create Axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: `${API_ROUTE}/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to attach authorization token
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = TokenManager.getAccessToken();
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor to handle token refresh logic
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const response = error.response;

    // Skip if not a 401 error or token validation error
    if (!response || response.status !== 401 || response.data?.code !== 'token_not_valid') {
      return Promise.reject(error);
    }

    // Prevent infinite retry loops
    if (originalRequest._retry) {
      TokenManager.clearTokens();
      TokenManager.redirectToLogin();
      return Promise.reject(error);
    }

    // Attempt token refresh
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      TokenManager.clearTokens();
      TokenManager.redirectToLogin();
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;
      
      const refreshResponse = await axios.post(`${API_ROUTE}/api/token/refresh/`, {
        refresh: refreshToken,
      });

      TokenManager.setAccessToken(refreshResponse.data.access);
      originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
      
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      TokenManager.clearTokens();
      TokenManager.redirectToLogin();
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;