/**
 * Module Factory - Creates standardized CRUD modules
 * Inspired by Odoo's modular architecture
 */
import { ComponentType } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FrontModule, AppRoute, MenuItem } from "@/app/ModuleRegistry";
import { api } from "@/lib/axios";
import PageTitle from "@/components/utilitie/PageTitle";
import { CrudPage } from "./CrudPage";

// ─── Types ────────────────────────────────────────────────────
export type ServiceName = "userManagement" | "transport" | "product" | "hr" | "stock";

export interface ModuleEntityConfig<T = any> {
  /** Unique entity key (e.g. "vehicle", "employee") */
  key: string;
  /** Display label */
  label: string;
  /** API endpoint path (e.g. "/vehicle") */
  endpoint: string;
  /** Backend service name */
  service: ServiceName;
  /** Table columns */
  columns: ColumnDef<T>[];
  /** Permission prefix (e.g. "vehicle" => vehicle.read, vehicle.create) */
  permissionPrefix: string;
  /** Search fields for the API query param */
  searchFields?: string[];
}

export interface GroupedModuleConfig {
  /** Module name (e.g. "transport") */
  name: string;
  /** Sidebar group label */
  label: string;
  /** Sidebar icon */
  icon: ComponentType<any>;
  /** Sidebar base path */
  basePath: string;
  /** Permission for viewing the group */
  permission?: string;
  /** Entity definitions */
  entities: ModuleEntityConfig[];
}

// ─── API Factory ──────────────────────────────────────────────
export function createEntityApi(service: ServiceName, endpoint: string) {
  const svc = api[service];
  return {
    list: async (params: { search?: string } = {}) => {
      const query = params.search ? `?search=${params.search}` : "";
      return svc.get(`${endpoint}/list${query}`);
    },
    listPaginated: async (params: { page?: number; limit?: number; search?: string } = {}) => {
      const query = new URLSearchParams();
      if (params.page) query.set("page", String(params.page));
      if (params.limit) query.set("limit", String(params.limit));
      if (params.search) query.set("search", params.search);
      const qs = query.toString();
      return svc.get(`${endpoint}${qs ? `?${qs}` : ""}`);
    },
    get: async (id: string) => svc.get(`${endpoint}/${id}`),
    create: async (data: any) => svc.post(endpoint, data),
    update: async (id: string, data: any) => svc.patch(`${endpoint}/${id}`, data),
    delete: async (id: string) => svc.delete(`${endpoint}/${id}`),
  };
}

// ─── List Page Factory ────────────────────────────────────────
export function createListPage(config: ModuleEntityConfig) {
  const entityApi = createEntityApi(config.service, config.endpoint);

  return function GeneratedListPage() {
    return (
      <CrudPage
        config={{
          title: config.label,
          queryKey: [config.key],
          queryFn: entityApi.list,
          columns: config.columns,
          deleteFn: entityApi.delete,
          permissions: {
            read: `${config.permissionPrefix}.read`,
            create: `${config.permissionPrefix}.create`,
            update: `${config.permissionPrefix}.update`,
            delete: `${config.permissionPrefix}.delete`,
          },
        }}
      />
    );
  };
}

// ─── Module Factory ───────────────────────────────────────────
export function createGroupedModule(config: GroupedModuleConfig): FrontModule {
  const routes: AppRoute[] = [];
  const children: MenuItem[] = [];
  const permissions: string[] = [];

  for (const entity of config.entities) {
    const ListPage = createListPage(entity);
    const path = `${config.basePath}/${entity.key}`;

    routes.push({
      path,
      element: (
        <>
          <PageTitle title={entity.label} />
          <ListPage />
        </>
      ),
      permission: `${entity.permissionPrefix}.read`,
    });

    children.push({
      id: `${config.name}-${entity.key}`,
      label: entity.label,
      path,
      permission: `${entity.permissionPrefix}.read`,
    });

    permissions.push(
      `${entity.permissionPrefix}.read`,
      `${entity.permissionPrefix}.create`,
      `${entity.permissionPrefix}.update`,
      `${entity.permissionPrefix}.delete`
    );
  }

  const menu: MenuItem[] = [
    {
      id: config.name,
      label: config.label,
      path: config.entities.length === 1 ? `${config.basePath}/${config.entities[0].key}` : undefined,
      icon: config.icon,
      permission: config.permission,
      children: config.entities.length > 1 ? children : undefined,
    },
  ];

  return {
    name: config.name,
    routes,
    menu,
    permissions,
  };
}
