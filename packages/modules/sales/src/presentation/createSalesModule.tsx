import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { TrendingUp } from "lucide-react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { SALES_PERMISSIONS } from "../domain/permissions";
import SalesShell from "./SalesShell";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

export interface SalesModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
}

export function createSalesModule({ PageTitle }: SalesModuleDeps): FrontModule {
  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "Sales" }),
    createElement(SalesShell)
  );

  return {
    name: "sales",
    routes: [
      { path: "/sales", element: routeElement, permission: "customer.read" },
    ] as AppRoute[],
    menu: [
      { id: "sales", label: "Sales", path: "/sales", icon: TrendingUp, permission: "customer.read" },
    ] as MenuItem[],
    permissions: [...SALES_PERMISSIONS],
  };
}
