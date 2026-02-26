import { AppLayout, type AppLayoutConfig, ModuleShell, salesMenuItems, salesModuleInfo, ShellNavItem } from "@kwim/shared-ui";
import { salesModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Users, FileText, Tag, UserCog } from "lucide-react";
import { Dashboard, createPlaceholderPage } from "./pages";

const CustomersPage = createPlaceholderPage("Clients", "Gérer les clients");
const OrdersPage = createPlaceholderPage("Commandes", "Gérer les commandes");
const QuotationsPage = createPlaceholderPage("Devis", "Gérer les devis");
const SalesTeamsPage = createPlaceholderPage("Équipes de vente", "Gérer les équipes de vente");
const PricingRulesPage = createPlaceholderPage("Règles de prix", "Gérer les règles de prix");

const pageComponents: Record<string, React.ComponentType> = {
  "dashboard": Dashboard,
  "customers": CustomersPage,
  "orders": OrdersPage,
  "quotations": QuotationsPage,
  "sales-teams": SalesTeamsPage,
  "pricing-rules": PricingRulesPage,
};

const items: ShellNavItem[] = salesMenuItems.map((item) => ({
  ...item,
  component: pageComponents[item.key] || Dashboard,
}));

function App() {
  const navigate = useNavigate();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Sales",
    menus: salesModuleConfig.menu,
    user: {
      fullName: "Sales User",
      email: "sales@kwimsoft.com",
      role: "Sales Manager",
    },
    quickActions: [
      {
        icon: ShoppingCart,
        label: "Nouvelle commande",
        description: "Créer une commande",
        shortcut: "⌘N",
        onClick: () => navigate("/orders/new"),
      },
      {
        icon: FileText,
        label: "Nouveau devis",
        description: "Créer un devis",
        onClick: () => navigate("/quotations/new"),
      },
      {
        icon: Users,
        label: "Nouveau client",
        description: "Ajouter un client",
        onClick: () => navigate("/customers/new"),
      },
      {
        icon: Tag,
        label: "Règles de prix",
        description: "Configurer les prix",
        onClick: () => navigate("/pricing-rules"),
      },
      {
        icon: UserCog,
        label: "Équipes",
        description: "Gérer les équipes",
        onClick: () => navigate("/sales-teams"),
      },
    ],
    notifications: [
      {
        id: "1",
        title: "Nouvelle commande",
        message: "Une nouvelle commande a été reçue",
        type: "success",
        time: "3 min ago",
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
        title={salesModuleInfo.title}
        breadcrumbPath={salesModuleInfo.breadcrumbPath}
        items={items}
        defaultSelected="dashboard"
        enableSearch
      />
    </AppLayout>
  );
}

export default App;
