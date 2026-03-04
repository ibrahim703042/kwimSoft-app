import type { AxiosInstance } from "axios";

export type ServiceName = 
  | "users"
  | "transport"
  | "hr"
  | "inventory"
  | "sales"
  | "procurement"
  | "manufacturing"
  | "finance"
  | "crm"
  | "maintenance"
  | "carwash"
  | "product"
  | "stock";

export interface ModuleEntityConfig {
  key: string;
  label: string;
  icon?: React.ComponentType<any>;
  path: string;
  endpoint?: string;
}

export interface GroupedModuleConfig {
  moduleName: string;
  basePath: string;
  service: ServiceName;
  entities: ModuleEntityConfig[];
}

export function createGroupedModule(config: GroupedModuleConfig) {
  return config;
}

let _apiClient: AxiosInstance | null = null;

export function setApiClient(client: AxiosInstance) {
  _apiClient = client;
}

export function getApiClient(): AxiosInstance {
  if (!_apiClient) {
    throw new Error(
      "API client not configured. Call setApiClient() before using createEntityApi."
    );
  }
  return _apiClient;
}

export function createEntityApi<T = any>(service: ServiceName, endpoint: string) {
  const basePath = `/api/${service}${endpoint}`;

  return {
    list: async (params?: Record<string, any>) => {
      const client = getApiClient();
      const response = await client.get<{ data: T[] }>(basePath, { params });
      return response;
    },
    get: async (id: string) => {
      const client = getApiClient();
      const response = await client.get<{ data: T }>(`${basePath}/${id}`);
      return response;
    },
    create: async (data: Partial<T>) => {
      const client = getApiClient();
      const response = await client.post<{ data: T }>(basePath, data);
      return response;
    },
    update: async (id: string, data: Partial<T>) => {
      const client = getApiClient();
      const response = await client.put<{ data: T }>(`${basePath}/${id}`, data);
      return response;
    },
    delete: async (id: string) => {
      const client = getApiClient();
      const response = await client.delete(`${basePath}/${id}`);
      return response;
    },
  };
}

export function createListPage<T>(_config: {
  title: string;
  endpoint: string;
  service: ServiceName;
  columns: any[];
}) {
  return function ListPage() {
    return null;
  };
}
