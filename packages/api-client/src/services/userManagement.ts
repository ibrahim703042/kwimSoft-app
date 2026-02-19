import apiClient from "./apiClient";
import { API_CONFIG } from "@kwim/config";

const BASE_URL = API_CONFIG.userManagement.baseUrl;

// User Management API
export const userApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) => {
    return apiClient.get(`${BASE_URL}${API_CONFIG.userManagement.endpoints.users}`, { params });
  },
  getById: (id: string) => {
    return apiClient.get(`${BASE_URL}${API_CONFIG.userManagement.endpoints.users}/${id}`);
  },
  create: (data: any) => {
    return apiClient.post(`${BASE_URL}${API_CONFIG.userManagement.endpoints.users}`, data);
  },
  update: (id: string, data: any) => {
    return apiClient.patch(`${BASE_URL}${API_CONFIG.userManagement.endpoints.users}/${id}`, data);
  },
  delete: (id: string) => {
    return apiClient.delete(`${BASE_URL}${API_CONFIG.userManagement.endpoints.users}/${id}`);
  },
};

// Role Management API
export const roleApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    return apiClient.get(`${BASE_URL}/role`, { params });
  },
  getById: (id: string) => {
    return apiClient.get(`${BASE_URL}/role/${id}`);
  },
  create: (data: any) => {
    return apiClient.post(`${BASE_URL}/role`, data);
  },
  update: (id: string, data: any) => {
    return apiClient.patch(`${BASE_URL}/role/${id}`, data);
  },
  delete: (id: string) => {
    return apiClient.delete(`${BASE_URL}/role/${id}`);
  },
};

// Group Management API
export const groupApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    return apiClient.get(`${BASE_URL}${API_CONFIG.userManagement.endpoints.groups}`, { params });
  },
  getById: (id: string) => {
    return apiClient.get(`${BASE_URL}${API_CONFIG.userManagement.endpoints.groups}/${id}`);
  },
  create: (data: any) => {
    return apiClient.post(`${BASE_URL}${API_CONFIG.userManagement.endpoints.groups}`, data);
  },
  update: (id: string, data: any) => {
    return apiClient.patch(`${BASE_URL}${API_CONFIG.userManagement.endpoints.groups}/${id}`, data);
  },
  delete: (id: string) => {
    return apiClient.delete(`${BASE_URL}${API_CONFIG.userManagement.endpoints.groups}/${id}`);
  },
};

// Auth API
export const authApi = {
  login: (credentials: { username: string; password: string }) => {
    return apiClient.post(`${BASE_URL}${API_CONFIG.userManagement.endpoints.auth}/login`, credentials);
  },
  logout: (refreshToken: string) => {
    return apiClient.post(`${BASE_URL}${API_CONFIG.userManagement.endpoints.auth}/logout`, { refreshToken });
  },
  refresh: (refreshToken: string) => {
    return apiClient.post(`${BASE_URL}${API_CONFIG.userManagement.endpoints.auth}/refresh`, { refreshToken });
  },
  getCurrentUser: () => {
    return apiClient.post(`${BASE_URL}${API_CONFIG.userManagement.endpoints.auth}/me`);
  },
};

// Tenant/Organization Management API
export const tenantApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    return apiClient.get(`${BASE_URL}/tenant`, { params });
  },
  getById: (id: string) => {
    return apiClient.get(`${BASE_URL}/tenant/${id}`);
  },
  create: (data: any) => {
    return apiClient.post(`${BASE_URL}/tenant`, data);
  },
  update: (id: string, data: any) => {
    return apiClient.patch(`${BASE_URL}/tenant/${id}`, data);
  },
  delete: (id: string) => {
    return apiClient.delete(`${BASE_URL}/tenant/${id}`);
  },
};

// Profile Management API
export const profileApi = {
  get: () => {
    return apiClient.get(`${BASE_URL}${API_CONFIG.userManagement.endpoints.profile}`);
  },
  update: (data: any) => {
    return apiClient.patch(`${BASE_URL}${API_CONFIG.userManagement.endpoints.profile}`, data);
  },
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post(`${BASE_URL}${API_CONFIG.userManagement.endpoints.profile}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Permission Management API
export const permissionApi = {
  getAll: () => {
    return apiClient.get(`${BASE_URL}/permission`);
  },
  getByModule: (module: string) => {
    return apiClient.get(`${BASE_URL}/permission/module/${module}`);
  },
};
