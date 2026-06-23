import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { Droplets } from "lucide-react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { CARWASH_PERMISSIONS } from "../domain/permissions";
import CarwashShell from "./CarwashShell";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

export interface CarwashModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
}

export function createCarwashModule({ PageTitle }: CarwashModuleDeps): FrontModule {
  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "Carwash" }),
    createElement(CarwashShell)
  );

  return {
    name: "carwash",
    routes: [
      { path: "/carwash", element: routeElement, permission: "wash_service.read" },
    ] as AppRoute[],
    menu: [
      { id: "carwash", label: "Carwash", path: "/carwash", icon: Droplets, permission: "wash_service.read" },
    ] as MenuItem[],
    permissions: [...CARWASH_PERMISSIONS],
  };
}
