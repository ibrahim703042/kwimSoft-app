import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { Bus } from "lucide-react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { TRANSPORT_PERMISSIONS } from "../domain/permissions";
import TransportShell from "./TransportShell";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

export interface TransportModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
}

export function createTransportModule({ PageTitle }: TransportModuleDeps): FrontModule {
  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "Transport" }),
    createElement(TransportShell)
  );

  return {
    name: "transport",
    routes: [
      {
        path: "/transport",
        element: routeElement,
        permission: "driver.read",
      },
    ] as AppRoute[],
    menu: [
      {
        id: "transport",
        label: "Transport",
        path: "/transport",
        icon: Bus,
        permission: "driver.read",
      },
    ] as MenuItem[],
    permissions: [...TRANSPORT_PERMISSIONS],
  };
}
