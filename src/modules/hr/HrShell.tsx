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
  Users, UserCheck, Group, GitFork, BookUser, SquareUser,
  Building2, Briefcase, FileText, CalendarOff,
  Clock, Wallet, UserPlus, GraduationCap, Receipt,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";

// ── Custom pages (existing real implementations) ──────────────
import DriverListPage from "@/modules/transport/driver/pages/DriverListPage";
import GroupNew from "@/modules/user/pages/GroupNew";
import RoleNew from "@/modules/user/pages/RoleNew";
import UserNew from "@/modules/user/pages/UserNew";
import UserSessionNew from "@/modules/user/pages/UserSessionNew";

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

// ── All tabs organized by section ─────────────────────────────
const items: ShellNavItem[] = [
  // ▸ People
  { key: "employees",   label: "Employés",         icon: Users,          component: EmployeePage },
  { key: "staff",       label: "Staff / Chauffeurs",icon: UserCheck,     component: DriverListPage },
  { key: "users",       label: "Utilisateurs",     icon: SquareUser,     component: UserNew },

  // ▸ Access & Security
  { key: "groups",      label: "Groupes",          icon: Group,          component: GroupNew },
  { key: "roles",       label: "Rôles",            icon: GitFork,        component: RoleNew },
  { key: "sessions",    label: "Sessions",         icon: BookUser,       component: UserSessionNew },

  // ▸ Organization
  { key: "departments", label: "Départements",     icon: Building2,      component: DepartmentPage },
  { key: "positions",   label: "Postes",           icon: Briefcase,      component: PositionPage },

  // ▸ HR Operations
  { key: "contracts",   label: "Contrats",         icon: FileText,       component: ContractPage },
  { key: "leave",       label: "Congés",           icon: CalendarOff,    component: LeavePage },
  { key: "attendance",  label: "Présences",        icon: Clock,          component: AttendancePage },
  { key: "payroll",     label: "Paie",             icon: Wallet,         component: PayrollPage },
  { key: "recruitment", label: "Recrutement",      icon: UserPlus,       component: RecruitmentPage },
  { key: "training",    label: "Formations",       icon: GraduationCap,  component: TrainingPage },
  { key: "expenses",    label: "Notes de frais",   icon: Receipt,        component: ExpensePage },
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
