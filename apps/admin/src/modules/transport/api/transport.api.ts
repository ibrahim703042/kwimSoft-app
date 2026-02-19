import { apiClient } from "@/core/api";
import { API_ROUTE, API_ROUTE_PASSWORD } from "@/config";

export const driverApi = {
  list: async (params: { search?: string } = {}) => {
    const url = params.search 
      ? `${API_ROUTE_PASSWORD}/drivers?search=${params.search}` 
      : `${API_ROUTE_PASSWORD}/drivers`;
    return apiClient.get(url);
  },

  get: async (id: string) => {
    return apiClient.get(`${API_ROUTE}/drivers/${id}`);
  },

  create: async (data: any) => {
    return apiClient.post(`${API_ROUTE}/drivers`, data);
  },

  update: async (id: string, data: any) => {
    return apiClient.put(`${API_ROUTE}/drivers/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`${API_ROUTE}/drivers/${id}`);
  },
};
