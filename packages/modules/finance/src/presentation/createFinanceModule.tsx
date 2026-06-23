import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { DollarSign } from "lucide-react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { FINANCE_PERMISSIONS } from "../domain/permissions";
import FinanceShell from "./FinanceShell";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

export interface FinanceModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
}

export function createFinanceModule({ PageTitle }: FinanceModuleDeps): FrontModule {
  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "Finance" }),
    createElement(FinanceShell)
  );

  return {
    name: "finance",
    routes: [
      { path: "/finance", element: routeElement, permission: "account.read" },
    ] as AppRoute[],
    menu: [
      { id: "finance", label: "Finance", path: "/finance", icon: DollarSign, permission: "account.read" },
    ] as MenuItem[],
    permissions: [...FINANCE_PERMISSIONS],
  };
}
