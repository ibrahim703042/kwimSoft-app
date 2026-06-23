/**
 * Unified HR & People Management Shell
 *
 * Consolidates all people-related modules:
 * - Staff/Drivers (from old Administration)
 * - Users, Groups, Roles, Sessions (from old User Management)
 * - Employees, Departments, Positions, Contracts, Leave,
 *   Attendance, Payroll, Recruitment, Training, Expenses (HR entities)
 */
import {
  Users,
  Building2, Briefcase, FileText, CalendarOff,
  Clock, Wallet, UserPlus, GraduationCap, Receipt,
  LayoutGrid,
  LayoutDashboard,
  CreditCard,
  ListChecks,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@kwim/shared-ui";

import {
  EmployeePage,
  EmployeeCardTemplatePage,
  DepartmentPage,
  PositionPage,
  ContractPage,
  LeavePage,
  AttendancePage,
  AttendanceLogPage,
  PayrollPage,
  RecruitmentPage,
  TrainingPage,
  ExpensePage,
} from "./pages";
import type { ComponentType } from "react";
import HrDashboard from "./HrDashboard";

export interface HrShellProps {
  breadcrumbPath?: string;
  UserManagement?: ComponentType;
}

export default function HrShell({ breadcrumbPath = "/hr", UserManagement }: Readonly<HrShellProps>) {
  const items: ShellNavItem[] = [
    { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, component: HrDashboard },
    { key: "employees", label: "EmployÃ©s", icon: Users, component: EmployeePage },
    { key: "employee-card-template", label: "ModÃ¨le carte employÃ©", icon: CreditCard, component: EmployeeCardTemplatePage },
    { key: "departments", label: "DÃ©partements", icon: Building2, component: DepartmentPage },
    { key: "positions", label: "Postes", icon: Briefcase, component: PositionPage },
    { key: "contracts", label: "Contrats", icon: FileText, component: ContractPage },
    { key: "leave", label: "CongÃ©s", icon: CalendarOff, component: LeavePage },
    { key: "attendance", label: "PrÃ©sences", icon: Clock, component: AttendancePage },
    { key: "attendance-log", label: "Journal des prÃ©sences", icon: ListChecks, component: AttendanceLogPage },
    { key: "payroll", label: "Paie", icon: Wallet, component: PayrollPage },
    { key: "recruitment", label: "Recrutement", icon: UserPlus, component: RecruitmentPage },
    { key: "training", label: "Formations", icon: GraduationCap, component: TrainingPage },
    { key: "expenses", label: "Notes de frais", icon: Receipt, component: ExpensePage },
    ...(UserManagement ? [{ key: "user-tabs", label: "Gestion Utilisateurs", icon: LayoutGrid, component: UserManagement }] : []),
  ];

  return (
    <ModuleShell
      title="RH & Personnel"
      breadcrumbPath={breadcrumbPath}
      items={items}
      defaultSelected="dashboard"
      enableSearch
    />
  );
}

