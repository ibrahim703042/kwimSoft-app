import apiClient from "@/core/api/apiClient";
import { API_CONFIG } from "@/config";

const BASE_URL = API_CONFIG.userManagement.baseUrl;

// User Management API
export const userApi = {
  // Get all users
  getAll: (params?: { page?: number; limit?: number; search?: string }) => {
    return apiClient.get(`${BASE_URL}${API_CONFIG.userManagement.endpoints.users}`, { params });
  },

  // Get user by ID
  getById: (id: string) => {
    return apiClient.get(`${BASE_URL}${API_CONFIG.userManagement.endpoints.users}/${id}`);
  },

  // Create user
  create: (data: any) => {
    return apiClient.post(`${BASE_URL}${API_CONFIG.userManagement.endpoints.users}`, data);
  },

  // Update user
  update: (id: string, data: any) => {
    return apiClient.patch(`${BASE_URL}${API_CONFIG.userManagement.endpoints.users}/${id}`, data);
  },

  // Delete user
  delete: (id: string) => {
    return apiClient.delete(`${BASE_URL}${API_CONFIG.userManagement.endpoints.users}/${id}`);
  },
};

// Role Management API
export const roleApi = {
  // Get all roles
  getAll: (params?: { page?: number; limit?: number }) => {
    return apiClient.get(`${BASE_URL}/role`, { params });
  },

  // Get role by ID
  getById: (id: string) => {
    return apiClient.get(`${BASE_URL}/role/${id}`);
  },

  // Create role
  create: (data: any) => {
    return apiClient.post(`${BASE_URL}/role`, data);
  },

  // Update role
  update: (id: string, data: any) => {
    return apiClient.patch(`${BASE_URL}/role/${id}`, data);
  },

  // Delete role
  delete: (id: string) => {
    return apiClient.delete(`${BASE_URL}/role/${id}`);
  },
};

// Group Management API
export const groupApi = {
  // Get all groups
  getAll: (params?: { page?: number; limit?: number }) => {
    return apiClient.get(`${BASE_URL}${API_CONFIG.userManagement.endpoints.groups}`, { params });
  },

  // Get group by ID
  getById: (id: string) => {
    return apiClient.get(`${BASE_URL}${API_CONFIG.userManagement.endpoints.groups}/${id}`);
  },

  // Create group
  create: (data: any) => {
    return apiClient.post(`${BASE_URL}${API_CONFIG.userManagement.endpoints.groups}`, data);
  },

  // Update group
  update: (id: string, data: any) => {
    return apiClient.patch(`${BASE_URL}${API_CONFIG.userManagement.endpoints.groups}/${id}`, data);
  },

  // Delete group
  delete: (id: string) => {
    return apiClient.delete(`${BASE_URL}${API_CONFIG.userManagement.endpoints.groups}/${id}`);
  },
};

// User Session Management API
export const userSessionApi = {
  // Get all sessions
  getAll: (params?: { page?: number; limit?: number; userId?: string }) => {
    return apiClient.get(`${BASE_URL}/user-session`, { params });
  },

  // Get session by ID
  getById: (id: string) => {
    return apiClient.get(`${BASE_URL}/user-session/${id}`);
  },

  // Invalidate session
  invalidate: (id: string) => {
    return apiClient.delete(`${BASE_URL}/user-session/${id}`);
  },

  // Get active sessions for a user
  getActiveByUser: (userId: string) => {
    return apiClient.get(`${BASE_URL}/user-session/user/${userId}/active`);
  },
};

// Auth API
export const authApi = {
  // Login
  login: (credentials: { username: string; password: string }) => {
    return apiClient.post(`${BASE_URL}${API_CONFIG.userManagement.endpoints.auth}/login`, credentials);
  },

  // Logout
  logout: (refreshToken: string) => {
    return apiClient.post(`${BASE_URL}${API_CONFIG.userManagement.endpoints.auth}/logout`, { refreshToken });
  },

  // Refresh token
  refresh: (refreshToken: string) => {
    return apiClient.post(`${BASE_URL}${API_CONFIG.userManagement.endpoints.auth}/refresh`, { refreshToken });
  },

  // Get current user
  getCurrentUser: () => {
    return apiClient.post(`${BASE_URL}${API_CONFIG.userManagement.endpoints.auth}/me`);
  },
};

// Tenant/Organization Management API
export const tenantApi = {
  // Get all tenants
  getAll: (params?: { page?: number; limit?: number }) => {
    return apiClient.get(`${BASE_URL}/tenant`, { params });
  },

  // Get tenant by ID
  getById: (id: string) => {
    return apiClient.get(`${BASE_URL}/tenant/${id}`);
  },

  // Create tenant
  create: (data: any) => {
    return apiClient.post(`${BASE_URL}/tenant`, data);
  },

  // Update tenant
  update: (id: string, data: any) => {
    return apiClient.patch(`${BASE_URL}/tenant/${id}`, data);
  },

  // Delete tenant
  delete: (id: string) => {
    return apiClient.delete(`${BASE_URL}/tenant/${id}`);
  },
};

// Profile Management API
export const profileApi = {
  // Get user profile
  get: () => {
    return apiClient.get(`${BASE_URL}${API_CONFIG.userManagement.endpoints.profile}`);
  },

  // Update profile
  update: (data: any) => {
    return apiClient.patch(`${BASE_URL}${API_CONFIG.userManagement.endpoints.profile}`, data);
  },

  // Upload avatar
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
  // Get all permissions
  getAll: () => {
    return apiClient.get(`${BASE_URL}/permission`);
  },

  // Get permissions by module
  getByModule: (module: string) => {
    return apiClient.get(`${BASE_URL}/permission/module/${module}`);
  },
};
