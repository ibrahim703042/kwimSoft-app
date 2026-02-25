/**
 * Unified HR & People Management Module
 *
 * Consolidates:
 * - Old "Administration" → Staff/Drivers
 * - Old "User Management" → Users, Groups, Roles, Sessions
 * - HR entities → Employees, Departments, Positions, Contracts,
 *   Leave, Attendance, Payroll, Recruitment, Training, Expenses
 */
import { FrontModule, AppRoute, MenuItem } from "@/app/ModuleRegistry";
import { Users } from "lucide-react";
import PageTitle from "@/components/utilitie/PageTitle";
import HrShell from "./pages/payroll/PayrollShell";

export const hrModule: FrontModule = {
  name: "hr",
  routes: [
    {
      path: "/hr",
      element: (
        <>
          <PageTitle title="HR & People" />
          <HrShell />
        </>
      ),
      permission: "employee.read",
    },
  ] as AppRoute[],
  menu: [
    {
      id: "hr",
      label: "HR",
      path: "/hr",
      icon: Users,
      permission: "employee.read",
    },
  ] as MenuItem[],
  permissions: [
    // People
    "employee.read", "employee.create", "employee.update", "employee.delete",
    "driver.read", "driver.create", "driver.update", "driver.delete",
    // Access
    "user.read", "user.create", "user.update", "user.delete",
    "role.read", "role.create", "role.update", "role.delete",
    "group.read", "group.create", "group.update", "group.delete",
    // Organization
    "department.read", "department.create", "department.update", "department.delete",
    "position.read", "position.create", "position.update", "position.delete",
    // HR Operations
    "contract.read", "contract.create", "contract.update", "contract.delete",
    "leave.read", "leave.create", "leave.update", "leave.delete",
    "attendance.read", "attendance.create", "attendance.update", "attendance.delete",
    "payroll.read", "payroll.create", "payroll.update", "payroll.delete",
    "recruitment.read", "recruitment.create", "recruitment.update", "recruitment.delete",
    "training.read", "training.create", "training.update", "training.delete",
    "expense.read", "expense.create", "expense.update", "expense.delete",
  ],
};
