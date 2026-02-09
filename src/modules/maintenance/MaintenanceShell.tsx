import {
  LayoutDashboard, Wrench, ClipboardCheck,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";

import {
  MaintenanceDashboard,
  WorkOrderPage,
  InspectionPage,
} from "./pages";

const items: ShellNavItem[] = [
  { key: "dashboard",    label: "Tableau de bord",    icon: LayoutDashboard, component: MaintenanceDashboard },
  { key: "work-orders",  label: "Ordres de travail",  icon: Wrench,          component: WorkOrderPage },
  { key: "inspections",  label: "Inspections",        icon: ClipboardCheck,  component: InspectionPage },
];

export default function MaintenanceShell() {
  return (
    <ModuleShell
      title="Maintenance"
      breadcrumbPath="/maintenance"
      items={items}
      enableSearch
    />
  );
}
