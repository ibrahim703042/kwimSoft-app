import apiClient from "@kwim/api-client";
import { API_CONFIG } from "@kwim/config";
import type { User } from "./types";

/**
 * Fetch authoritative user profile and permissions from the backend.
 * Call after login to replace client-decoded JWT claims.
 */
export async function fetchCurrentUser(): Promise<Partial<User>> {
  const meUrl = `${API_CONFIG.userManagement.baseUrl}${API_CONFIG.userManagement.endpoints.auth}${API_CONFIG.userManagement.endpoints.me ?? "/me"}`;
  const response = await apiClient.get(meUrl);
  const data = response.data?.data ?? response.data;
  return {
    id: data._id ?? data.id,
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    tenantId: data.tenantId,
    tenantCode: data.tenantCode,
    roles: data.roles ?? [],
    permissions: data.permissions ?? [],
    avatar: data.avatar,
    isEmailVerified: data.isEmailVerified,
    status: data.status,
  };
}
