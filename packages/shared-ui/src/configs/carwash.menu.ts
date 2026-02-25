import {
  LayoutDashboard,
  Droplets,
  Warehouse,
  ShoppingCart,
} from "lucide-react";
import { BaseMenuItem } from "../types/module";

export const carwashMenuItems: BaseMenuItem[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "wash-services", label: "Services de lavage", icon: Droplets },
  { key: "bays", label: "Baies", icon: Warehouse },
  { key: "wash-orders", label: "Commandes", icon: ShoppingCart },
];

export const carwashModuleInfo = {
  name: "carwash",
  displayName: "Lavage Auto",
  title: "Lavage Auto",
  breadcrumbPath: "/carwash",
};
