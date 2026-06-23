import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { Package } from "lucide-react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { PRODUCT_PERMISSIONS } from "../domain/permissions";
import ProductShell from "./ProductShell";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

export interface ProductModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
}

export function createProductModule({ PageTitle }: ProductModuleDeps): FrontModule {
  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "Products" }),
    createElement(ProductShell)
  );

  return {
    name: "product",
    routes: [
      { path: "/products", element: routeElement, permission: "product.read" },
    ] as AppRoute[],
    menu: [
      { id: "product", label: "Products", path: "/products", icon: Package, permission: "product.read" },
    ] as MenuItem[],
    permissions: [...PRODUCT_PERMISSIONS],
  };
}
