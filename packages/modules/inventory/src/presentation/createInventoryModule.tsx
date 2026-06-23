import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { Warehouse } from "lucide-react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { INVENTORY_PERMISSIONS } from "../domain/permissions";
import InventoryShell from "./InventoryShell";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

export interface InventoryModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
}

export function createInventoryModule({ PageTitle }: InventoryModuleDeps): FrontModule {
  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "Inventory" }),
    createElement(InventoryShell)
  );

  return {
    name: "inventory",
    routes: [
      { path: "/inventory", element: routeElement, permission: "warehouse.read" },
    ] as AppRoute[],
    menu: [
      { id: "inventory", label: "Inventory", path: "/inventory", icon: Warehouse, permission: "warehouse.read" },
    ] as MenuItem[],
    permissions: [...INVENTORY_PERMISSIONS],
  };
}
