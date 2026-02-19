/**
 * Finance & Accounting Module
 *
 * Entities:
 * - Accounts, Invoices, Payments, Budgets,
 *   Journal Entries, Tax Configuration
 */
import { FrontModule, AppRoute, MenuItem } from "@/app/ModuleRegistry";
import { DollarSign } from "lucide-react";
import PageTitle from "@/components/utilitie/PageTitle";
import FinanceShell from "./FinanceShell";

export const financeModule: FrontModule = {
  name: "finance",
  routes: [
    {
      path: "/finance",
      element: (
        <>
          <PageTitle title="Finance" />
          <FinanceShell />
        </>
      ),
      permission: "account.read",
    },
  ] as AppRoute[],
  menu: [
    {
      id: "finance",
      label: "Finance",
      path: "/finance",
      icon: DollarSign,
      permission: "account.read",
    },
  ] as MenuItem[],
  permissions: [
    "account.read", "account.create", "account.update", "account.delete",
    "invoice.read", "invoice.create", "invoice.update", "invoice.delete",
    "payment.read", "payment.create", "payment.update", "payment.delete",
    "budget.read", "budget.create", "budget.update", "budget.delete",
    "journal_entry.read", "journal_entry.create", "journal_entry.update", "journal_entry.delete",
    "tax_config.read", "tax_config.create", "tax_config.update", "tax_config.delete",
  ],
};
