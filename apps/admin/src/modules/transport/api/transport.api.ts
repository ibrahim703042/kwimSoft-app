import { apiClient } from "@/core/api";
import { API_ROUTE, API_ROUTE_PASSWORD } from "@/config";
import { STATION_COMPANY_ID } from "@/modules/transport/gare/station.types";
import type { StationFormValues } from "@/modules/transport/gare/station.types";

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

export const stationApi = {
  list: async (params: { search?: string } = {}) => {
    const baseUrl = `${API_ROUTE}/stations/no-pagination/company/${STATION_COMPANY_ID}`;
    const url = params.search ? `${baseUrl}?search=${encodeURIComponent(params.search)}` : baseUrl;
    const response = await apiClient.get(url);
    return { data: response.data?.data ?? response.data ?? [] };
  },

  create: async (values: StationFormValues) => {
    return apiClient.post(`${API_ROUTE}/stations`, values);
  },

  update: async (id: string, values: StationFormValues) => {
    return apiClient.patch(`${API_ROUTE}/stations/${id}`, values);
  },

  delete: async (id: string) => {
    return apiClient.delete(`${API_ROUTE}/stations/${id}`);
  },
};
