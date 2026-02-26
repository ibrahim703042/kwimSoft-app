import { AppLayout, type AppLayoutConfig, ModuleShell, financeMenuItems, financeModuleInfo, ShellNavItem } from "@kwim/shared-ui";
import { financeModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";
import { DollarSign, FileText, CreditCard, PiggyBank, BookOpen, Calculator } from "lucide-react";
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
  const navigate = useNavigate();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Finance",
    menus: financeModuleConfig.menu,
    user: {
      fullName: "Finance User",
      email: "finance@kwimsoft.com",
      role: "Accountant",
    },
    quickActions: [
      {
        icon: FileText,
        label: "Nouvelle facture",
        description: "Créer une facture",
        shortcut: "⌘N",
        onClick: () => navigate("/invoices/new"),
      },
      {
        icon: CreditCard,
        label: "Paiement",
        description: "Enregistrer un paiement",
        onClick: () => navigate("/payments/new"),
      },
      {
        icon: BookOpen,
        label: "Écriture",
        description: "Nouvelle écriture comptable",
        onClick: () => navigate("/journal-entries/new"),
      },
      {
        icon: PiggyBank,
        label: "Budget",
        description: "Créer un budget",
        onClick: () => navigate("/budgets/new"),
      },
      {
        icon: Calculator,
        label: "Rapport",
        description: "Générer un rapport",
        onClick: () => navigate("/reports"),
      },
    ],
    notifications: [
      {
        id: "1",
        title: "Facture due",
        message: "La facture #456 arrive à échéance",
        type: "warning",
        time: "1 hour ago",
        read: false,
      },
    ],
    onLogout: () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <ModuleShell
        title={financeModuleInfo.title}
        breadcrumbPath={financeModuleInfo.breadcrumbPath}
        items={items}
        defaultSelected="dashboard"
        enableSearch
      />
    </AppLayout>
  );
}

export default App;
