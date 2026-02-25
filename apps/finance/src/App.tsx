import { ModuleShell, financeMenuItems, financeModuleInfo, ShellNavItem } from "@kwim/shared-ui";
import { Dashboard, createPlaceholderPage } from "./pages";

const AccountsPage = createPlaceholderPage("Comptes", "Gérer les comptes financiers");
const InvoicesPage = createPlaceholderPage("Factures", "Gérer les factures");
const PaymentsPage = createPlaceholderPage("Paiements", "Suivre les paiements");
const BudgetsPage = createPlaceholderPage("Budgets", "Gérer les budgets");
const JournalEntriesPage = createPlaceholderPage("Écritures comptables", "Gérer les écritures");
const TaxConfigPage = createPlaceholderPage("Configuration fiscale", "Paramètres fiscaux");

const pageComponents: Record<string, React.ComponentType> = {
  "dashboard": Dashboard,
  "accounts": AccountsPage,
  "invoices": InvoicesPage,
  "payments": PaymentsPage,
  "budgets": BudgetsPage,
  "journal-entries": JournalEntriesPage,
  "tax-config": TaxConfigPage,
};

const items: ShellNavItem[] = financeMenuItems.map((item) => ({
  ...item,
  component: pageComponents[item.key] || Dashboard,
}));

function App() {
  return (
    <ModuleShell
      title={financeModuleInfo.title}
      breadcrumbPath={financeModuleInfo.breadcrumbPath}
      items={items}
      defaultSelected="dashboard"
      enableSearch
    />
  );
}

export default App;
