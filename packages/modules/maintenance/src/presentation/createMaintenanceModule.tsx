import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { Wrench } from "lucide-react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { MAINTENANCE_PERMISSIONS } from "../domain/permissions";
import MaintenanceShell from "./MaintenanceShell";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

export interface MaintenanceModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
}

export function createMaintenanceModule({ PageTitle }: MaintenanceModuleDeps): FrontModule {
  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "Maintenance" }),
    createElement(MaintenanceShell)
  );

  return {
    name: "maintenance",
    routes: [
      { path: "/maintenance", element: routeElement, permission: "maintenance.read" },
    ] as AppRoute[],
    menu: [
      { id: "maintenance", label: "Maintenance", path: "/maintenance", icon: Wrench, permission: "maintenance.read" },
    ] as MenuItem[],
    permissions: [...MAINTENANCE_PERMISSIONS],
  };
}
