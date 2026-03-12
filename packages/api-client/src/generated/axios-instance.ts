import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@kwim/config';

const AXIOS_INSTANCE = Axios.create({
  timeout: 30000,
});

AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const tenantId = localStorage.getItem('tenant_id');
    if (tenantId && config.headers) {
      config.headers['x-tenant-id'] = tenantId;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshUrl = `${API_CONFIG.userManagement.baseUrl}${API_CONFIG.userManagement.endpoints.auth}/refresh`;
        const response = await Axios.post(refreshUrl, { refreshToken });

        const { accessToken } = response.data;
        localStorage.setItem('access_token', accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error - Adding cancel method to promise
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
