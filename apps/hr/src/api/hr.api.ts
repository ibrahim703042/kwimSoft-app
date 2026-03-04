/**
 * HR API — employee, department, position, contract, leave, attendance, payroll, recruitment, training, expense, loan, notice, company, branch, settings, project, task, client
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
export const payrollApi = {
  ...crudApi(EP.payroll),
  getByEmployee: (employeeId: string, year?: number) =>
    apiClient.get(`${BASE}${EP.payroll}/employee/${employeeId}`, { params: { year } }),
  getByPeriod: (employeeId: string, year: number, month: number) =>
    apiClient.get(`${BASE}${EP.payroll}/employee/${employeeId}/${year}/${month}`),
};
export const recruitmentApi = crudApi(EP.recruitment);
export const trainingApi = crudApi(EP.training);
export const expenseApi = crudApi(EP.expense);
export const idCardTemplateApi = crudApi(EP.idCardTemplate);
export const loanApi = {
  ...crudApi(EP.loan),
  getStatistics: () => apiClient.get(`${BASE}${EP.loan}/statistics`),
  getByEmployee: (employeeId: string) =>
    apiClient.get(`${BASE}${EP.loan}/employee/${employeeId}`),
  approve: (id: string, data: { approverId?: string; comments?: string }) =>
    apiClient.patch(`${BASE}${EP.loan}/${id}/approve`, data),
  reject: (id: string, data: { reason: string }) =>
    apiClient.patch(`${BASE}${EP.loan}/${id}/reject`, data),
  disburse: (id: string) =>
    apiClient.patch(`${BASE}${EP.loan}/${id}/disburse`),
  recordPayment: (id: string, data: { amount: number; paidDate?: string; transactionReference?: string; notes?: string }) =>
    apiClient.post(`${BASE}${EP.loan}/${id}/payments`, data),
  getPaymentHistory: (id: string) =>
    apiClient.get(`${BASE}${EP.loan}/${id}/payments`),
  getUpcomingPayments: (id: string) =>
    apiClient.get(`${BASE}${EP.loan}/${id}/upcoming-payments`),
  generateSchedule: (id: string, data?: { startDate?: string }) =>
    apiClient.post(`${BASE}${EP.loan}/${id}/generate-schedule`, data || {}),
  markPaymentAsPaid: (id: string, index: number, data: { amount?: number; paidDate?: string; transactionReference?: string; notes?: string }) =>
    apiClient.patch(`${BASE}${EP.loan}/${id}/payments/${index}`, data),
};
export const loanTypeApi = crudApi(EP.loanType);
export const noticeApi = crudApi(EP.notice);
export const companyApi = crudApi(EP.company);
export const branchApi = crudApi(EP.branch);
export const settingsApi = {
  ...crudApi(EP.settings),
  getDefault: () => apiClient.get(`${BASE}${EP.settings}/default`),
};
export const projectApi = crudApi(EP.project);
export const taskApi = crudApi(EP.task);
export const clientApi = crudApi(EP.client);
