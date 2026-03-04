/**
 * PayrollShell - Payroll & Expenses workflow with route-based navigation
 */
import { Routes, Route, Navigate, Link } from "react-router-dom";
import {
  Wallet,
  Receipt,
  Settings,
  Banknote,
  UserCircle,
  FileBarChart,
  CheckSquare,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@kwim/shared-ui";
import PayrollPage from "./PayrollPage";
import PayrollSettingPage from "./PayrollSettingPage";
import AdvanceSalaryPage from "./AdvanceSalaryPage";
import EmployeeSalaryPage from "./EmployeeSalaryPage";
import TaxReportPage from "./TaxReportPage";
import PayrollTasksPage from "./PayrollTasksPage";
import ExpensePage from "../expenses/ExpensePage";

const items: ShellNavItem[] = [
  { key: "payroll", label: "Fiches de paie", icon: Wallet, path: "." },
  { key: "setting", label: "Paramètres paie", icon: Settings, path: "setting" },
  { key: "advance-salary", label: "Avances sur salaire", icon: Banknote, path: "advance-salary" },
  { key: "employee-salary", label: "Salaires employés", icon: UserCircle, path: "employee-salary" },
  { key: "tax-report", label: "Rapport fiscal", icon: FileBarChart, path: "tax-report" },
  { key: "tasks", label: "Tâches paie", icon: CheckSquare, path: "tasks" },
  { key: "expenses", label: "Notes de frais", icon: Receipt, path: "expenses" },
];

export default function PayrollShell() {
  return (
    <ModuleShell
      title="Paie & Dépenses"
      items={items}
      LinkComponent={Link}
      enableSearch
    >
      <Routes>
        <Route index element={<PayrollPage />} />
        <Route path="setting" element={<PayrollSettingPage />} />
        <Route path="advance-salary" element={<AdvanceSalaryPage />} />
        <Route path="employee-salary" element={<EmployeeSalaryPage />} />
        <Route path="tax-report" element={<TaxReportPage />} />
        <Route path="tasks" element={<PayrollTasksPage />} />
        <Route path="expenses" element={<ExpensePage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </ModuleShell>
  );
}
