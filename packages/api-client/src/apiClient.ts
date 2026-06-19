import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_CONFIG } from "@kwim/config";

const AUTH_USE_HTTPONLY_COOKIES =
  (import.meta.env.VITE_AUTH_USE_COOKIES ?? "").toString() === "true";

export const apiClient = axios.create({
  timeout: 30000,
  withCredentials: AUTH_USE_HTTPONLY_COOKIES,
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const refreshUrl = `${API_CONFIG.userManagement.baseUrl}${API_CONFIG.userManagement.endpoints.auth}/refresh`;
    const response = await axios.post(refreshUrl, { refreshToken });
    const { accessToken } = response.data;

    if (!accessToken) {
      throw new Error("No access token in refresh response");
    }

    localStorage.setItem("access_token", accessToken);
    return accessToken as string;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

function clearSessionAndRedirect() {
  localStorage.removeItem("user");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  globalThis.location.href = "/login";
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!AUTH_USE_HTTPONLY_COOKIES) {
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => { throw error; }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (AUTH_USE_HTTPONLY_COOKIES) {
          const refreshUrl = `${API_CONFIG.userManagement.baseUrl}${API_CONFIG.userManagement.endpoints.auth}/refresh`;
          const response = await axios.post(refreshUrl, {}, { withCredentials: true });
          const { accessToken } = response.data;
          if (accessToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        }

        const accessToken = await refreshAccessToken();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearSessionAndRedirect();
        throw refreshError;
      }
    }

    throw error;
  }
);

export default apiClient;
