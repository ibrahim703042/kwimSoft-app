import {
  LayoutDashboard, Droplets, Warehouse, ShoppingCart,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";

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

export default function CarwashShell() {
  return (
    <ModuleShell
      title="Lavage Auto"
      breadcrumbPath="/carwash"
      items={items}
      enableSearch
    />
  );
}
