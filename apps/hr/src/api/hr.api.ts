/**
 * HR API — employee, department, position, contract, leave, attendance, payroll
 */
import { apiClient } from "@kwim/api-client";
import { API_CONFIG } from "@kwim/config";

const BASE = API_CONFIG.hr.baseUrl;
const EP = API_CONFIG.hr.endpoints;

function crudApi(endpoint: string) {
  return {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
      apiClient.get(`${BASE}${endpoint}`, { params }),
    getById: (id: string) => apiClient.get(`${BASE}${endpoint}/${id}`),
    create: (data: Record<string, unknown>) =>
      apiClient.post(`${BASE}${endpoint}`, data),
    update: (id: string, data: Record<string, unknown>) =>
      apiClient.patch(`${BASE}${endpoint}/${id}`, data),
    delete: (id: string) => apiClient.delete(`${BASE}${endpoint}/${id}`),
  };
}

export const employeeApi = crudApi(EP.employee);
export const departmentApi = crudApi(EP.department);
export const positionApi = crudApi(EP.position);
export const contractApi = crudApi(EP.contract);
export const leaveApi = crudApi(EP.leave);
export const attendanceApi = crudApi(EP.attendance);
export const payrollApi = crudApi(EP.payroll);
