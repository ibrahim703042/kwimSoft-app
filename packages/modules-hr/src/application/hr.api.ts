/**
 * HR Module API Layer — connects to the HR microservice
 */
import apiClient from "@kwim/api-client";
import { API_CONFIG } from "@kwim/config";

const BASE_URL = API_CONFIG.hr.baseUrl;
const EP = API_CONFIG.hr.endpoints;

function crudApi(endpoint: string) {
  return {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
      apiClient.get(`${BASE_URL}${endpoint}`, { params }),
    getById: (id: string) =>
      apiClient.get(`${BASE_URL}${endpoint}/${id}`),
    create: (data: unknown) =>
      apiClient.post(`${BASE_URL}${endpoint}`, data),
    update: (id: string, data: unknown) =>
      apiClient.patch(`${BASE_URL}${endpoint}/${id}`, data),
    delete: (id: string) =>
      apiClient.delete(`${BASE_URL}${endpoint}/${id}`),
  };
}

export const employeeApi = crudApi(EP.employee);
export const departmentApi = crudApi(EP.department);
export const positionApi = crudApi(EP.position);
export const contractApi = crudApi(EP.contract);
export const leaveApi = crudApi(EP.leave);
export const attendanceApi = crudApi(EP.attendance);
export const payrollApi = crudApi(EP.payroll);
export const recruitmentApi = crudApi(EP.recruitment);
export const trainingApi = crudApi(EP.training);
export const expenseApi = crudApi(EP.expense);
export const idCardTemplateApi = crudApi(EP.idCardTemplate ?? "/id-card-template");
