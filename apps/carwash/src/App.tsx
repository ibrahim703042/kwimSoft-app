import { AppLayout, type AppLayoutConfig, ModuleShell, carwashMenuItems, carwashModuleInfo, ShellNavItem } from "@kwim/shared-ui";
import { carwashModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";
import { Car, ClipboardList, DollarSign, Users } from "lucide-react";
import { Dashboard, createPlaceholderPage } from "./pages";

const WashServicesPage = createPlaceholderPage("Services de lavage", "Gérer les services de lavage");
const BaysPage = createPlaceholderPage("Baies", "Gérer les baies de lavage");
const WashOrdersPage = createPlaceholderPage("Commandes", "Gérer les commandes de lavage");

const pageComponents: Record<string, React.ComponentType> = {
  "dashboard": Dashboard,
  "wash-services": WashServicesPage,
  "bays": BaysPage,
  "wash-orders": WashOrdersPage,
};

const items: ShellNavItem[] = carwashMenuItems.map((item) => ({
  ...item,
  component: pageComponents[item.key] || Dashboard,
}));

function App() {
  const navigate = useNavigate();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Carwash",
    menus: carwashModuleConfig.menu,
    user: {
      fullName: "Carwash User",
      email: "carwash@kwimsoft.com",
      role: "Carwash Manager",
    },
    quickActions: [
      {
        icon: Car,
        label: "Nouveau lavage",
        description: "Créer une nouvelle commande",
        shortcut: "⌘N",
        onClick: () => navigate("/orders/new"),
      },
      {
        icon: ClipboardList,
        label: "Services",
        description: "Gérer les services",
        onClick: () => navigate("/services"),
      },
      {
        icon: DollarSign,
        label: "Facturation",
        description: "Voir les factures",
        onClick: () => navigate("/invoices"),
      },
      {
        icon: Users,
        label: "Clients",
        description: "Gérer les clients",
        onClick: () => navigate("/customers"),
      },
    ],
    notifications: [
      {
        id: "1",
        title: "Nouvelle commande",
        message: "Une nouvelle commande de lavage a été reçue",
        type: "info",
        time: "2 min ago",
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
        title={carwashModuleInfo.title}
        breadcrumbPath={carwashModuleInfo.breadcrumbPath}
        items={items}
        defaultSelected="dashboard"
        enableSearch
      />
    </AppLayout>
  );
}

export default App;
