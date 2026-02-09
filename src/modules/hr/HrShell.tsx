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
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";

// ── Custom pages (existing real implementations) ──────────────

// ── HR entity pages (full CRUD with Dialog forms) ─────────────
import {
  EmployeePage,
  DepartmentPage,
  PositionPage,
  ContractPage,
  LeavePage,
  AttendancePage,
  PayrollPage,
  RecruitmentPage,
  TrainingPage,
  ExpensePage,
} from "./pages";
import { UserTabbedView } from "../user";

// ── All tabs organized by section ─────────────────────────────
const items: ShellNavItem[] = [

  // { key: "hr-tabs", label: "Gestion RH", icon: LayoutGrid, component: HrTabbedView },

  // ▸ People
  { key: "employees", label: "Employés", icon: Users, component: EmployeePage },

  // ▸ Organization
  { key: "departments", label: "Départements", icon: Building2, component: DepartmentPage },
  { key: "positions", label: "Postes", icon: Briefcase, component: PositionPage },

  // ▸ HR Operations
  { key: "contracts", label: "Contrats", icon: FileText, component: ContractPage },
  { key: "leave", label: "Congés", icon: CalendarOff, component: LeavePage },
  { key: "attendance", label: "Présences", icon: Clock, component: AttendancePage },
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
      enableSearch
    />
  );
}
