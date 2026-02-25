import {
  LayoutDashboard,
  Warehouse,
  MapPin,
  BarChart3,
  ArrowLeftRight,
  Repeat,
  ClipboardCheck,
} from "lucide-react";
import { BaseMenuItem } from "../types/module";

export const inventoryMenuItems: BaseMenuItem[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "warehouses", label: "Entrepôts", icon: Warehouse },
  { key: "locations", label: "Emplacements", icon: MapPin },
  { key: "stock-levels", label: "Niveaux de stock", icon: BarChart3 },
  { key: "stock-movements", label: "Mouvements de stock", icon: ArrowLeftRight },
  { key: "transfers", label: "Transferts", icon: Repeat },
  { key: "inventory-counts", label: "Inventaires", icon: ClipboardCheck },
];

export const inventoryModuleInfo = {
  name: "inventory",
  displayName: "Inventaire & Entrepôt",
  title: "Inventaire & Entrepôt",
  breadcrumbPath: "/inventory",
};
