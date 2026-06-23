import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { ShoppingCart } from "lucide-react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { PROCUREMENT_PERMISSIONS } from "../domain/permissions";
import ProcurementShell from "./ProcurementShell";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

export interface ProcurementModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
}

export function createProcurementModule({ PageTitle }: ProcurementModuleDeps): FrontModule {
  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "Procurement" }),
    createElement(ProcurementShell)
  );

  return {
    name: "procurement",
    routes: [
      { path: "/procurement", element: routeElement, permission: "supplier.read" },
    ] as AppRoute[],
    menu: [
      { id: "procurement", label: "Procurement", path: "/procurement", icon: ShoppingCart, permission: "supplier.read" },
    ] as MenuItem[],
    permissions: [...PROCUREMENT_PERMISSIONS],
  };
}
