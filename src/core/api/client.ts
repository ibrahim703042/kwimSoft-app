import { axiosInstance } from "@/lib/axios";
import { useTenantStore } from "@/core/tenant/tenant.store";
import { ApiClient, ApiClientConfig } from "./types";
import { AxiosRequestConfig } from "axios";

/**
 * Enhanced API client that automatically injects tenant headers
 */
const createApiClient = (): ApiClient => {
  const injectTenantHeaders = (config: ApiClientConfig = {}): AxiosRequestConfig => {
    // Skip tenant headers if explicitly requested
    if (config.skipTenantHeaders) {
      const { skipTenantHeaders, ...restConfig } = config;
      return restConfig;
    }

    const { entrepriseId, etablissementId } = useTenantStore.getState();

    return {
      ...config,
      headers: {
        ...config.headers,
        ...(entrepriseId && { "X-Entreprise-Id": entrepriseId }),
        ...(etablissementId && { "X-Etablissement-Id": etablissementId }),
      },
    };
  };

  return {
    get: (url, config) => {
      return axiosInstance.get(url, injectTenantHeaders(config));
    },

    post: (url, data, config) => {
      return axiosInstance.post(url, data, injectTenantHeaders(config));
    },

    put: (url, data, config) => {
      return axiosInstance.put(url, data, injectTenantHeaders(config));
    },

    patch: (url, data, config) => {
      return axiosInstance.patch(url, data, injectTenantHeaders(config));
    },

    delete: (url, config) => {
      return axiosInstance.delete(url, injectTenantHeaders(config));
    },
  };
};

export const apiClient = createApiClient();

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
