import { apiClient } from "@kwim/api-client";
import { API_CONFIG } from "@kwim/config";
import { STATION_COMPANY_ID, type StationFormValues } from "../pages/stations/station.types";

const TRANSPORT_BASE = API_CONFIG.transport.baseUrl;

export const stationApi = {
  list: async (params: { search?: string } = {}) => {
    const baseUrl = `${TRANSPORT_BASE}/stations/no-pagination/company/${STATION_COMPANY_ID}`;
    const url = params.search ? `${baseUrl}?search=${encodeURIComponent(params.search)}` : baseUrl;
    const response = await apiClient.get(url);
    return { data: response.data?.data ?? response.data ?? [] };
  },

  create: async (values: StationFormValues) => {
    return apiClient.post(`${TRANSPORT_BASE}/stations`, values);
  },

  update: async (id: string, values: StationFormValues) => {
    return apiClient.patch(`${TRANSPORT_BASE}/stations/${id}`, values);
  },

  delete: async (id: string) => {
    return apiClient.delete(`${TRANSPORT_BASE}/stations/${id}`);
  },
};
