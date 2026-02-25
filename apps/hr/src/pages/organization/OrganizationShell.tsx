/**
 * OrganizationShell - Departments & Positions Management Shell
 */
import { Building2, Briefcase } from "lucide-react";
import { ModuleShell, ShellNavItem } from "@kwim/shared-ui";
import DepartmentPage from "../departements/DepartmentPage";
import PositionPage from "../positions/PositionPage";

const items: ShellNavItem[] = [
  { key: "departments", label: "Départements", icon: Building2, component: DepartmentPage },
  { key: "positions", label: "Postes", icon: Briefcase, component: PositionPage },
];

export default function OrganizationShell() {
  return (
    <ModuleShell
      title="Organisation"
      items={items}
      defaultSelected="departments"
      enableSearch
    />
  );
}
