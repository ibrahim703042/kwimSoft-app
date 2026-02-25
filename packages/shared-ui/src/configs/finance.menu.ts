import {
  LayoutDashboard,
  Landmark,
  FileText,
  CreditCard,
  PiggyBank,
  BookOpen,
  Calculator,
} from "lucide-react";
import { BaseMenuItem } from "../types/module";

export const financeMenuItems: BaseMenuItem[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "accounts", label: "Comptes", icon: Landmark },
  { key: "invoices", label: "Factures", icon: FileText },
  { key: "payments", label: "Paiements", icon: CreditCard },
  { key: "budgets", label: "Budgets", icon: PiggyBank },
  { key: "journal-entries", label: "Écritures comptables", icon: BookOpen },
  { key: "tax-config", label: "Configuration fiscale", icon: Calculator },
];

export const financeModuleInfo = {
  name: "finance",
  displayName: "Finance & Comptabilité",
  title: "Finance & Comptabilité",
  breadcrumbPath: "/finance",
};
