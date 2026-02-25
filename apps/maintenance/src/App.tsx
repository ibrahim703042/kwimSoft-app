import { ModuleShell, maintenanceMenuItems, maintenanceModuleInfo, ShellNavItem } from "@kwim/shared-ui";
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
  return (
    <ModuleShell
      title={maintenanceModuleInfo.title}
      breadcrumbPath={maintenanceModuleInfo.breadcrumbPath}
      items={items}
      defaultSelected="dashboard"
      enableSearch
    />
  );
}

export default App;
