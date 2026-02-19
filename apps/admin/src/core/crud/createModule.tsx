/**
 * Module Factory - Creates standardized CRUD modules
 * Inspired by Odoo's modular architecture
 *
 * Grouped modules now render inside a ModuleShell with sidebar navigation
 * (same pattern as Administration and UserManagement).
 */
import { ComponentType } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { FrontModule, AppRoute, MenuItem } from "@/app/ModuleRegistry";
import { api } from "@/lib/axios";
import PageTitle from "@/components/utilitie/PageTitle";
import { CrudPage } from "./CrudPage";
import { GroupedModuleShell } from "./GroupedModuleShell";
import { LucideIcon } from "lucide-react";

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
  /** Optional Lucide icon for the sidebar item */
  icon?: LucideIcon;
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
          deleteFn: async (id: string) => { await entityApi.delete(id); },
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
/**
 * Creates a FrontModule.
 *
 * - **Multiple entities** → Single route with a ModuleShell (sidebar + tabs)
 * - **Single entity**     → Simple CrudPage (no extra sidebar)
 */
export function createGroupedModule(config: GroupedModuleConfig): FrontModule {
  const permissions: string[] = [];

  for (const entity of config.entities) {
    permissions.push(
      `${entity.permissionPrefix}.read`,
      `${entity.permissionPrefix}.create`,
      `${entity.permissionPrefix}.update`,
      `${entity.permissionPrefix}.delete`
    );
  }

  // ── Single entity: simple CrudPage (no shell) ──────────────
  if (config.entities.length === 1) {
    const entity = config.entities[0];
    const ListPage = createListPage(entity);

    const routes: AppRoute[] = [
      {
        path: config.basePath,
        element: (
          <>
            <PageTitle title={entity.label} />
            <ListPage />
          </>
        ),
        permission: config.permission,
      },
    ];

    const menu: MenuItem[] = [
      {
        id: config.name,
        label: config.label,
        path: config.basePath,
        icon: config.icon,
        permission: config.permission,
      },
    ];

    return { name: config.name, routes, menu, permissions };
  }

  // ── Multiple entities: ModuleShell with sidebar tabs ────────
  const entityIcons: Record<string, LucideIcon> = {};
  for (const entity of config.entities) {
    if (entity.icon) {
      entityIcons[entity.key] = entity.icon;
    }
  }

  const routes: AppRoute[] = [
    {
      path: config.basePath,
      element: (
        <>
          <PageTitle title={config.label} />
          <GroupedModuleShell
            title={config.label}
            basePath={config.basePath}
            entities={config.entities}
            icons={Object.keys(entityIcons).length > 0 ? entityIcons : undefined}
          />
        </>
      ),
      permission: config.permission,
    },
  ];

  const menu: MenuItem[] = [
    {
      id: config.name,
      label: config.label,
      path: config.basePath,
      icon: config.icon,
      permission: config.permission,
    },
  ];

  return { name: config.name, routes, menu, permissions };
}
