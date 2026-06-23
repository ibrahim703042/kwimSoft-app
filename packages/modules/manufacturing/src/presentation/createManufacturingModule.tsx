import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { Factory } from "lucide-react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { MANUFACTURING_PERMISSIONS } from "../domain/permissions";
import ManufacturingShell from "./ManufacturingShell";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

export interface ManufacturingModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
}

export function createManufacturingModule({ PageTitle }: ManufacturingModuleDeps): FrontModule {
  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "Manufacturing" }),
    createElement(ManufacturingShell)
  );

  return {
    name: "manufacturing",
    routes: [
      { path: "/manufacturing", element: routeElement, permission: "manufacturing_order.read" },
    ] as AppRoute[],
    menu: [
      { id: "manufacturing", label: "Manufacturing", path: "/manufacturing", icon: Factory, permission: "manufacturing_order.read" },
    ] as MenuItem[],
    permissions: [...MANUFACTURING_PERMISSIONS],
  };
}
