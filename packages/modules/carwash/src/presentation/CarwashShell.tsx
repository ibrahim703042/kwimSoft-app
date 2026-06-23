import {
  LayoutDashboard, Droplets, Warehouse, ShoppingCart,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@kwim/shared-ui";

import {
  CarwashDashboard,
  WashServicePage,
  BayPage,
  WashOrderPage,
} from "./pages";

const items: ShellNavItem[] = [
  { key: "dashboard",     label: "Tableau de bord",     icon: LayoutDashboard, component: CarwashDashboard },
  { key: "wash-services", label: "Services de lavage",  icon: Droplets,        component: WashServicePage },
  { key: "bays",          label: "Baies",               icon: Warehouse,       component: BayPage },
  { key: "wash-orders",   label: "Commandes",           icon: ShoppingCart,    component: WashOrderPage },
];

export default function CarwashShell({ breadcrumbPath = "/carwash" }: { breadcrumbPath?: string }) {
  return (
    <ModuleShell
      title="Lavage Auto"
      breadcrumbPath={breadcrumbPath}
      items={items}
      enableSearch
    />
  );
}
