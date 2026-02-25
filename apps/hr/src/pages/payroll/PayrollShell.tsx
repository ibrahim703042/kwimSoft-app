/**
 * PayrollShell - Payroll & Expenses Management Shell
 */
import { Wallet, Receipt } from "lucide-react";
import { ModuleShell, ShellNavItem } from "@kwim/shared-ui";
import PayrollPage from "./PayrollPage";
import ExpensePage from "../expenses/ExpensePage";

const items: ShellNavItem[] = [
  { key: "payroll", label: "Fiches de paie", icon: Wallet, component: PayrollPage },
  { key: "expenses", label: "Notes de frais", icon: Receipt, component: ExpensePage },
];

export default function PayrollShell() {
  return (
    <ModuleShell
      title="Paie & Dépenses"
      items={items}
      defaultSelected="payroll"
      enableSearch
    />
  );
}
