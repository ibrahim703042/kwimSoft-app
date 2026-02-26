import { AppLayout, type AppLayoutConfig, ModuleShell, maintenanceMenuItems, maintenanceModuleInfo, ShellNavItem } from "@kwim/shared-ui";
import { maintenanceModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";
import { Wrench, ClipboardCheck, Calendar, AlertTriangle, Settings } from "lucide-react";
import { Dashboard, createPlaceholderPage } from "./pages";

const WorkOrdersPage = createPlaceholderPage("Ordres de travail", "Gérer les ordres de travail");
const InspectionsPage = createPlaceholderPage("Inspections", "Gérer les inspections");

const pageComponents: Record<string, React.ComponentType> = {
  "dashboard": Dashboard,
  "work-orders": WorkOrdersPage,
  "inspections": InspectionsPage,
};

const items: ShellNavItem[] = maintenanceMenuItems.map((item) => ({
  ...item,
  component: pageComponents[item.key] || Dashboard,
}));

function App() {
  const navigate = useNavigate();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Maintenance",
    menus: maintenanceModuleConfig.menu,
    user: {
      fullName: "Maintenance User",
      email: "maintenance@kwimsoft.com",
      role: "Maintenance Manager",
    },
    quickActions: [
      {
        icon: Wrench,
        label: "Ordre de travail",
        description: "Créer un OT",
        shortcut: "⌘N",
        onClick: () => navigate("/work-orders/new"),
      },
      {
        icon: ClipboardCheck,
        label: "Inspection",
        description: "Planifier une inspection",
        onClick: () => navigate("/inspections/new"),
      },
      {
        icon: Calendar,
        label: "Maintenance",
        description: "Planifier une maintenance",
        onClick: () => navigate("/maintenance/schedule"),
      },
      {
        icon: AlertTriangle,
        label: "Incident",
        description: "Signaler un incident",
        onClick: () => navigate("/incidents/new"),
      },
      {
        icon: Settings,
        label: "Équipements",
        description: "Gérer les équipements",
        onClick: () => navigate("/equipment"),
      },
    ],
    notifications: [
      {
        id: "1",
        title: "Maintenance planifiée",
        message: "Maintenance préventive prévue pour demain",
        type: "info",
        time: "30 min ago",
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
        title={maintenanceModuleInfo.title}
        breadcrumbPath={maintenanceModuleInfo.breadcrumbPath}
        items={items}
        defaultSelected="dashboard"
        enableSearch
      />
    </AppLayout>
  );
}

export default App;
