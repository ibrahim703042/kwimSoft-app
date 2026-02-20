/**
 * HR Module API Layer
 * Connects to the HR microservice (port 9081)
 */
import apiClient from "@/core/api/apiClient";
import { API_CONFIG } from "@/config";

const BASE_URL = API_CONFIG.hr.baseUrl;
const EP = API_CONFIG.hr.endpoints;

// ─── Generic factory ──────────────────────────────────────────
function crudApi(endpoint: string) {
  return {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
      apiClient.get(`${BASE_URL}${endpoint}`, { params }),
    getById: (id: string) =>
      apiClient.get(`${BASE_URL}${endpoint}/${id}`),
    create: (data: any) =>
      apiClient.post(`${BASE_URL}${endpoint}`, data),
    update: (id: string, data: any) =>
      apiClient.patch(`${BASE_URL}${endpoint}/${id}`, data),
    delete: (id: string) =>
      apiClient.delete(`${BASE_URL}${endpoint}/${id}`),
  };
}

// ─── Exports ──────────────────────────────────────────────────
export const employeeApi    = crudApi(EP.employee);
export const departmentApi  = crudApi(EP.department);
export const positionApi    = crudApi(EP.position);
export const contractApi    = crudApi(EP.contract);
export const leaveApi       = crudApi(EP.leave);
export const attendanceApi  = crudApi(EP.attendance);
export const payrollApi     = crudApi(EP.payroll);
export const recruitmentApi = crudApi(EP.recruitment);
export const trainingApi    = crudApi(EP.training);
export const expenseApi     = crudApi(EP.expense);
export const idCardTemplateApi = crudApi(EP.idCardTemplate ?? "/id-card-template");