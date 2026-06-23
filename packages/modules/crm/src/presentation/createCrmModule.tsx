import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { Contact } from "lucide-react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { CRM_PERMISSIONS } from "../domain/permissions";
import CrmShell from "./CrmShell";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

export interface CrmModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
}

export function createCrmModule({ PageTitle }: CrmModuleDeps): FrontModule {
  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "CRM" }),
    createElement(CrmShell)
  );

  return {
    name: "crm",
    routes: [
      { path: "/crm", element: routeElement, permission: "contact.read" },
    ] as AppRoute[],
    menu: [
      { id: "crm", label: "CRM", path: "/crm", icon: Contact, permission: "contact.read" },
    ] as MenuItem[],
    permissions: [...CRM_PERMISSIONS],
  };
}
