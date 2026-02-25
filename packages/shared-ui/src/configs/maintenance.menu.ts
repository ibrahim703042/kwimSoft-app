import {
  LayoutDashboard,
  Wrench,
  ClipboardCheck,
} from "lucide-react";
import { BaseMenuItem } from "../types/module";

export const maintenanceMenuItems: BaseMenuItem[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "work-orders", label: "Ordres de travail", icon: Wrench },
  { key: "inspections", label: "Inspections", icon: ClipboardCheck },
];

export const maintenanceModuleInfo = {
  name: "maintenance",
  displayName: "Maintenance",
  title: "Maintenance",
  breadcrumbPath: "/maintenance",
};
