import {
  Landmark, FileText, CreditCard,
  PiggyBank, BookOpen, Calculator,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";

import {
  AccountPage,
  InvoicePage,
  PaymentPage,
  BudgetPage,
  JournalEntryPage,
  TaxConfigPage,
} from "./pages";

const items: ShellNavItem[] = [
  { key: "accounts", label: "Comptes", icon: Landmark, component: AccountPage },
  { key: "invoices", label: "Factures", icon: FileText, component: InvoicePage },
  { key: "payments", label: "Paiements", icon: CreditCard, component: PaymentPage },
  { key: "budgets", label: "Budgets", icon: PiggyBank, component: BudgetPage },
  { key: "journal-entries", label: "Écritures comptables", icon: BookOpen, component: JournalEntryPage },
  { key: "tax-config", label: "Configuration fiscale", icon: Calculator, component: TaxConfigPage },
];

export default function FinanceShell() {
  return (
    <ModuleShell
      title="Finance & Comptabilité"
      breadcrumbPath="/finance"
      items={items}
      enableSearch
    />
  );
}
