export * from './types';
export { apiClient as default, apiClient } from './apiClient';
export * from './services/userManagement';

/**
 * Helper to extract data from API response
 */
export const extractData = <T>(response: any): T => {
  return response.data?.data || response.data;
};

/**
 * Helper to handle API errors
 */
export const handleApiError = (error: any): never => {
  const message = error.response?.data?.message || error.message || "An error occurred";
  const code = error.response?.data?.code;
  const status = error.response?.status;

  throw {
    message,
    code,
    status,
    details: error.response?.data,
  };
};
