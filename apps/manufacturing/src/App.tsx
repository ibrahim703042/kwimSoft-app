import { AppLayout, type AppLayoutConfig, ModuleShell, manufacturingMenuItems, manufacturingModuleInfo, ShellNavItem } from "@kwim/shared-ui";
import { manufacturingModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";
import { Factory, ClipboardList, Wrench, Settings, CheckCircle } from "lucide-react";
import { Dashboard, createPlaceholderPage } from "./pages";

const ManufacturingOrdersPage = createPlaceholderPage("Ordres de fabrication", "Gérer les ordres de fabrication");
const BOMPage = createPlaceholderPage("Nomenclatures (BOM)", "Gérer les nomenclatures");
const WorkCentersPage = createPlaceholderPage("Postes de travail", "Gérer les postes de travail");
const OperationsPage = createPlaceholderPage("Opérations", "Gérer les opérations");
const QualityChecksPage = createPlaceholderPage("Contrôles qualité", "Gérer les contrôles qualité");

const pageComponents: Record<string, React.ComponentType> = {
  "dashboard": Dashboard,
  "manufacturing-orders": ManufacturingOrdersPage,
  "bom": BOMPage,
  "work-centers": WorkCentersPage,
  "operations": OperationsPage,
  "quality-checks": QualityChecksPage,
};

const items: ShellNavItem[] = manufacturingMenuItems.map((item) => ({
  ...item,
  component: pageComponents[item.key] || Dashboard,
}));

function App() {
  const navigate = useNavigate();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Manufacturing",
    menus: manufacturingModuleConfig.menu,
    user: {
      fullName: "Manufacturing User",
      email: "manufacturing@kwimsoft.com",
      role: "Production Manager",
    },
    quickActions: [
      {
        icon: ClipboardList,
        label: "Ordre de fabrication",
        description: "Créer un OF",
        shortcut: "⌘N",
        onClick: () => navigate("/manufacturing-orders/new"),
      },
      {
        icon: Factory,
        label: "Nomenclature",
        description: "Créer une BOM",
        onClick: () => navigate("/bom/new"),
      },
      {
        icon: Wrench,
        label: "Poste de travail",
        description: "Ajouter un poste",
        onClick: () => navigate("/work-centers/new"),
      },
      {
        icon: Settings,
        label: "Opération",
        description: "Créer une opération",
        onClick: () => navigate("/operations/new"),
      },
      {
        icon: CheckCircle,
        label: "Contrôle qualité",
        description: "Ajouter un contrôle",
        onClick: () => navigate("/quality-checks/new"),
      },
    ],
    notifications: [
      {
        id: "1",
        title: "OF terminé",
        message: "L'ordre de fabrication #101 est terminé",
        type: "success",
        time: "20 min ago",
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
        title={manufacturingModuleInfo.title}
        breadcrumbPath={manufacturingModuleInfo.breadcrumbPath}
        items={items}
        defaultSelected="dashboard"
        enableSearch
      />
    </AppLayout>
  );
}

export default App;
