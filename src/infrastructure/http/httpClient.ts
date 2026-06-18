import axios, { AxiosRequestConfig } from "axios";
import { env } from "@/core/config/env";
import { GUEST_TOKEN } from "@/core/auth/guestSession";

function getAuthToken(): string | null {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    const token = JSON.parse(stored)?.token ?? null;
    return token === GUEST_TOKEN ? null : token;
  } catch {
    return null;
  }
}

function isGuestSession(): boolean {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return false;
    const parsed = JSON.parse(stored);
    return parsed?.isGuest === true || parsed?.token === GUEST_TOKEN;
  } catch {
    return false;
  }
}

export const httpClient = axios.create({
  baseURL: `${env.apiBaseUrl}/`,
  headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!isGuestSession()) {
        localStorage.removeItem("user");
        if (!globalThis.location.pathname.startsWith("/login")) {
          globalThis.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export async function httpGet<T>(url: string, config?: AxiosRequestConfig) {
  const res = await httpClient.get<T>(url, config);
  return res.data;
}

export async function httpPost<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const res = await httpClient.post<T>(url, data, config);
  return res.data;
}

export async function httpPut<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const res = await httpClient.put<T>(url, data, config);
  return res.data;
}

export async function httpPatch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const res = await httpClient.patch<T>(url, data, config);
  return res.data;
}

export async function httpDelete<T>(url: string, config?: AxiosRequestConfig) {
  const res = await httpClient.delete<T>(url, config);
  return res.data;
}

export default httpClient;
