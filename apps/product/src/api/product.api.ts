import { apiClient } from "@kwim/api-client";
import { API_CONFIG } from "@kwim/config";

const BASE = API_CONFIG.product.baseUrl;
const EP = API_CONFIG.product.endpoints.category;

export interface CategoryData {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export const categoryApi = {
  list: async (params: { search?: string } = {}) => {
    const url = params.search ? `${BASE}${EP}?search=${encodeURIComponent(params.search)}` : `${BASE}${EP}`;
    const response = await apiClient.get(url);
    return { data: (response.data?.data ?? response.data ?? []) as CategoryData[] };
  },

  create: async (data: { name: string; description?: string }) => {
    return apiClient.post(`${BASE}${EP}`, data);
  },

  update: async (id: string, data: { name: string; description?: string }) => {
    return apiClient.patch(`${BASE}${EP}/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`${BASE}${EP}/${id}`);
  },
};
