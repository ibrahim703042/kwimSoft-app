import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { configureAdminArea } from "../domain/adminAreaContext";
import AdminAreaShell from "./AdminAreaShell";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
}

export interface AdminAreaModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
  getModules: () => { name: string }[];
}

export function createAdminAreaModule({ PageTitle, getModules }: AdminAreaModuleDeps): FrontModule {
  configureAdminArea({ getModules });

  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "Admin" }),
    createElement(AdminAreaShell)
  );

  return {
    name: "admin-area",
    routes: [{ path: "/console", element: routeElement }] as AppRoute[],
    menu: [] as MenuItem[],
  };
}
