import {
  LayoutDashboard, Wrench, ClipboardCheck,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@kwim/shared-ui";

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

export default function MaintenanceShell({ breadcrumbPath = "/maintenance" }: { breadcrumbPath?: string }) {
  return (
    <ModuleShell
      title="Maintenance"
      breadcrumbPath={breadcrumbPath}
      items={items}
      enableSearch
    />
  );
}
