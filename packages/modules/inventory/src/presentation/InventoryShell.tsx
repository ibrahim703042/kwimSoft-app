import {
  LayoutDashboard, Warehouse, MapPin, BarChart3,
  ArrowLeftRight, Repeat, ClipboardCheck,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@kwim/shared-ui";

import {
  InventoryDashboard,
  WarehousePage,
  LocationPage,
  StockLevelPage,
  StockMovementPage,
  TransferPage,
  InventoryCountPage,
} from "./pages";

const items: ShellNavItem[] = [
  { key: "dashboard",        label: "Tableau de bord",      icon: LayoutDashboard, component: InventoryDashboard },
  { key: "warehouses",       label: "Entrepôts",            icon: Warehouse,       component: WarehousePage },
  { key: "locations",        label: "Emplacements",         icon: MapPin,          component: LocationPage },
  { key: "stock-levels",     label: "Niveaux de stock",     icon: BarChart3,       component: StockLevelPage },
  { key: "stock-movements",  label: "Mouvements de stock",  icon: ArrowLeftRight,  component: StockMovementPage },
  { key: "transfers",        label: "Transferts",           icon: Repeat,          component: TransferPage },
  { key: "inventory-counts", label: "Inventaires",          icon: ClipboardCheck,  component: InventoryCountPage },
];

export default function InventoryShell({ breadcrumbPath = "/inventory" }: { breadcrumbPath?: string }) {
  return (
    <ModuleShell
      title="Inventaire & Entrepôt"
      breadcrumbPath={breadcrumbPath}
      items={items}
      enableSearch
    />
  );
}
