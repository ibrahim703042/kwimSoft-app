import { ModuleConfig } from "@kwim/shared-ui";
import {
  Users,
  Building2,
  Clock,
  Wallet,
  UserPlus,
  GraduationCap,
  LayoutDashboard,
  UserCog,
} from "lucide-react";

export const hrModuleConfig: ModuleConfig = {
  name: "hr",
  displayName: "HR Management",
  icon: Users,
  baseUrl: "/hr",

  quickActions: [
    {
      icon: Users,
      label: "New Employee",
      description: "Add a new employee",
      onClick: () => console.log("New employee"),
    },
    {
      icon: Wallet,
      label: "Run Payroll",
      description: "Process payroll",
      onClick: () => console.log("Run payroll"),
    },
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      id: "employees",
      label: "Employés",
      icon: Users,
      path: "/employees",
      children: [
        { id: "employee-list", label: "Liste des employés", path: "/employees" },
        { id: "employee-card", label: "Modèle carte", path: "/employees/card-template" },
        { id: "contracts", label: "Contrats", path: "/employees/contracts" },
      ],
    },
    {
      id: "organization",
      label: "Organisation",
      icon: Building2,
      path: "/organization",
      children: [
        { id: "departments", label: "Départements", path: "/organization/departments" },
        { id: "positions", label: "Postes", path: "/organization/positions" },
      ],
    },
    {
      id: "attendance",
      label: "Présences",
      icon: Clock,
      path: "/attendance",
      children: [
        { id: "attendance-daily", label: "Présences", path: "/attendance" },
        { id: "attendance-log", label: "Journal", path: "/attendance/log" },
        { id: "leave", label: "Congés", path: "/attendance/leave" },
      ],
    },
    {
      id: "payroll",
      label: "Paie",
      icon: Wallet,
      path: "/payroll",
      children: [
        { id: "payroll-list", label: "Fiches de paie", path: "/payroll" },
        { id: "expenses", label: "Notes de frais", path: "/payroll/expenses" },
      ],
    },
    {
      id: "recruitment",
      label: "Recrutement",
      icon: UserPlus,
      path: "/recruitment",
    },
    {
      id: "training",
      label: "Formations",
      icon: GraduationCap,
      path: "/training",
    },
    {
      id: "users",
      label: "Utilisateurs",
      icon: UserCog,
      path: "/users",
    },
  ],

  routes: [],

  permissions: [
    "employee.read", "employee.create", "employee.update", "employee.delete",
    "driver.read", "driver.create", "driver.update", "driver.delete",
    "user.read", "user.create", "user.update", "user.delete",
    "role.read", "role.create", "role.update", "role.delete",
    "group.read", "group.create", "group.update", "group.delete",
    "department.read", "department.create", "department.update", "department.delete",
    "position.read", "position.create", "position.update", "position.delete",
    "contract.read", "contract.create", "contract.update", "contract.delete",
    "leave.read", "leave.create", "leave.update", "leave.delete",
    "attendance.read", "attendance.create", "attendance.update", "attendance.delete",
    "payroll.read", "payroll.create", "payroll.update", "payroll.delete",
    "recruitment.read", "recruitment.create", "recruitment.update", "recruitment.delete",
    "training.read", "training.create", "training.update", "training.delete",
    "expense.read", "expense.create", "expense.update", "expense.delete",
  ],
};
