import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { Users } from "lucide-react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { HR_PERMISSIONS } from "../domain/permissions";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

export interface HrModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
  HrShell: ComponentType;
}

/**
 * Factory to compose the HR FrontModule with app-specific presentation components.
 */
export function createHrModule({ PageTitle, HrShell }: HrModuleDeps): FrontModule {
  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "HR & People" }),
    createElement(HrShell)
  );

  return {
    name: "hr",
    routes: [
      {
        path: "/hr",
        element: routeElement,
        permission: "employee.read",
      },
    ] as AppRoute[],
    menu: [
      {
        id: "hr",
        label: "HR",
        path: "/hr",
        icon: Users,
        permission: "employee.read",
      },
    ] as MenuItem[],
    permissions: [...HR_PERMISSIONS],
  };
}
