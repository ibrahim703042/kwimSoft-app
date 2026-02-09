import {
  LayoutDashboard, Factory, FileStack, Wrench, Settings2, ClipboardCheck,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";

import {
  ManufacturingDashboard,
  BOMPage,
  ManufacturingOrderPage,
  WorkCenterPage,
  OperationPage,
  QualityCheckPage,
} from "./pages";

const items: ShellNavItem[] = [
  { key: "dashboard",            label: "Tableau de bord",      icon: LayoutDashboard,  component: ManufacturingDashboard },
  { key: "manufacturing-orders", label: "Ordres de fabrication", icon: Factory,          component: ManufacturingOrderPage },
  { key: "bom",                  label: "Nomenclatures (BOM)",  icon: FileStack,        component: BOMPage },
  { key: "work-centers",         label: "Postes de travail",    icon: Wrench,           component: WorkCenterPage },
  { key: "operations",           label: "Opérations",           icon: Settings2,        component: OperationPage },
  { key: "quality-checks",       label: "Contrôles qualité",    icon: ClipboardCheck,   component: QualityCheckPage },
];

export default function ManufacturingShell() {
  return (
    <ModuleShell
      title="Fabrication"
      breadcrumbPath="/manufacturing"
      items={items}
      enableSearch
    />
  );
}
