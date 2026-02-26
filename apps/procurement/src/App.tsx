import { AppLayout, type AppLayoutConfig, ModuleShell, procurementMenuItems, procurementModuleInfo, ShellNavItem } from "@kwim/shared-ui";
import { procurementModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";
import { Package, Truck, FileText, ClipboardList, Building } from "lucide-react";
import { Dashboard, createPlaceholderPage } from "./pages";

const SuppliersPage = createPlaceholderPage("Fournisseurs", "Gérer les fournisseurs");
const PurchaseRequisitionsPage = createPlaceholderPage("Demandes d'achat", "Gérer les demandes d'achat");
const PurchaseOrdersPage = createPlaceholderPage("Bons de commande", "Gérer les bons de commande");
const RfqPage = createPlaceholderPage("Demandes de prix", "Gérer les demandes de prix");
const GoodsReceiptsPage = createPlaceholderPage("Réceptions", "Gérer les réceptions de marchandises");

const pageComponents: Record<string, React.ComponentType> = {
  "dashboard": Dashboard,
  "suppliers": SuppliersPage,
  "purchase-requisitions": PurchaseRequisitionsPage,
  "purchase-orders": PurchaseOrdersPage,
  "rfq": RfqPage,
  "goods-receipts": GoodsReceiptsPage,
};

const items: ShellNavItem[] = procurementMenuItems.map((item) => ({
  ...item,
  component: pageComponents[item.key] || Dashboard,
}));

function App() {
  const navigate = useNavigate();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Procurement",
    menus: procurementModuleConfig.menu,
    user: {
      fullName: "Procurement User",
      email: "procurement@kwimsoft.com",
      role: "Procurement Manager",
    },
    quickActions: [
      {
        icon: FileText,
        label: "Bon de commande",
        description: "Créer un bon de commande",
        shortcut: "⌘N",
        onClick: () => navigate("/purchase-orders/new"),
      },
      {
        icon: ClipboardList,
        label: "Demande d'achat",
        description: "Créer une demande",
        onClick: () => navigate("/purchase-requisitions/new"),
      },
      {
        icon: Building,
        label: "Fournisseur",
        description: "Ajouter un fournisseur",
        onClick: () => navigate("/suppliers/new"),
      },
      {
        icon: Package,
        label: "Réception",
        description: "Enregistrer une réception",
        onClick: () => navigate("/goods-receipts/new"),
      },
      {
        icon: Truck,
        label: "Demande de prix",
        description: "Créer une RFQ",
        onClick: () => navigate("/rfq/new"),
      },
    ],
    notifications: [
      {
        id: "1",
        title: "Bon de commande approuvé",
        message: "Le BC #789 a été approuvé",
        type: "success",
        time: "15 min ago",
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
        title={procurementModuleInfo.title}
        breadcrumbPath={procurementModuleInfo.breadcrumbPath}
        items={items}
        defaultSelected="dashboard"
        enableSearch
      />
    </AppLayout>
  );
}

export default App;
