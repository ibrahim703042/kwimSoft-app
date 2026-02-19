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
import { ModuleShell, ShellNavItem } from "@/core/ui";

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
import { UserTabbedView } from "../user";
import HrDashboard from "./HrDashboard";

// ── Sidebar: Dashboard first, then HR entities, then User management ─────
const items: ShellNavItem[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, component: HrDashboard },

  // ▸ People & Organization
  { key: "employees", label: "Employés", icon: Users, component: EmployeePage },
  { key: "employee-card-template", label: "Modèle carte employé", icon: CreditCard, component: EmployeeCardTemplatePage },

  // ▸ Organization
  { key: "departments", label: "Départements", icon: Building2, component: DepartmentPage },
  { key: "positions", label: "Postes", icon: Briefcase, component: PositionPage },

  // ▸ HR Operations
  { key: "contracts", label: "Contrats", icon: FileText, component: ContractPage },
  { key: "leave", label: "Congés", icon: CalendarOff, component: LeavePage },
  { key: "attendance", label: "Présences", icon: Clock, component: AttendancePage },
  { key: "attendance-log", label: "Journal des présences", icon: ListChecks, component: AttendanceLogPage },
  { key: "payroll", label: "Paie", icon: Wallet, component: PayrollPage },
  { key: "recruitment", label: "Recrutement", icon: UserPlus, component: RecruitmentPage },
  { key: "training", label: "Formations", icon: GraduationCap, component: TrainingPage },
  { key: "expenses", label: "Notes de frais", icon: Receipt, component: ExpensePage },

  // ▸ Access & Security
  { key: "user-tabs", label: "Gestion Utilisateurs", icon: LayoutGrid, component: UserTabbedView },
];

export default function HrShell() {
  return (
    <ModuleShell
      title="RH & Personnel"
      breadcrumbPath="/hr"
      items={items}
      defaultSelected="dashboard"
      enableSearch
    />
  );
}
