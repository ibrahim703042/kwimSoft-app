import { apiClient } from "@kwim/api-client";
import { API_CONFIG } from "@kwim/config";
import { STATION_COMPANY_ID, type StationFormValues } from "../domain/station.types";

const TRANSPORT_BASE = API_CONFIG.transport.baseUrl;
const USER_BASE = API_CONFIG.userManagement.baseUrl;

function listResponse(data: unknown): { data: unknown[] } {
  const body = data as { data?: unknown };
  if (Array.isArray(body?.data)) return { data: body.data };
  if (Array.isArray(data)) return { data };
  const nested = (body as { data?: { data?: unknown[] } })?.data?.data;
  if (Array.isArray(nested)) return { data: nested };
  return { data: [] };
}

export const driverApi = {
  list: async (params: { search?: string } = {}) => {
    const url = params.search
      ? `${USER_BASE}/drivers?search=${encodeURIComponent(params.search)}`
      : `${USER_BASE}/drivers`;
    const response = await apiClient.get(url);
    return listResponse(response.data);
  },
  get: async (id: string) => apiClient.get(`${TRANSPORT_BASE}/drivers/${id}`),
  create: async (data: object) => apiClient.post(`${TRANSPORT_BASE}/drivers`, data),
  update: async (id: string, data: object) => apiClient.put(`${TRANSPORT_BASE}/drivers/${id}`, data),
  delete: async (id: string) => apiClient.delete(`${TRANSPORT_BASE}/drivers/${id}`),
};

export const stationApi = {
  list: async (params: { search?: string } = {}) => {
    const baseUrl = `${TRANSPORT_BASE}/stations/no-pagination/company/${STATION_COMPANY_ID}`;
    const url = params.search ? `${baseUrl}?search=${encodeURIComponent(params.search)}` : baseUrl;
    const response = await apiClient.get(url);
    return listResponse(response.data);
  },
  create: async (values: StationFormValues) => apiClient.post(`${TRANSPORT_BASE}/stations`, values),
  update: async (id: string, values: StationFormValues) =>
    apiClient.patch(`${TRANSPORT_BASE}/stations/${id}`, values),
  delete: async (id: string) => apiClient.delete(`${TRANSPORT_BASE}/stations/${id}`),
};

function transportCrud(endpoint: string) {
  return {
    list: async (params: { search?: string } = {}) => {
      const url = params.search
        ? `${TRANSPORT_BASE}${endpoint}?search=${encodeURIComponent(params.search)}`
        : `${TRANSPORT_BASE}${endpoint}`;
      const response = await apiClient.get(url);
      return listResponse(response.data);
    },
    get: async (id: string) => apiClient.get(`${TRANSPORT_BASE}${endpoint}/${id}`),
    create: async (data: object) => apiClient.post(`${TRANSPORT_BASE}${endpoint}`, data),
    update: async (id: string, data: object) => apiClient.patch(`${TRANSPORT_BASE}${endpoint}/${id}`, data),
    delete: async (id: string) => apiClient.delete(`${TRANSPORT_BASE}${endpoint}/${id}`),
  };
}

export const vehicleApi = transportCrud("/vehicle");
export const tripApi = transportCrud("/trip");
export const seatApi = transportCrud("/seat");
export const ticketApi = transportCrud("/ticket");
export const scheduleApi = transportCrud("/schedule");
export const reservationApi = transportCrud("/reservation");
export const busApi = transportCrud("/buses");
