import { ModuleShell, carwashMenuItems, carwashModuleInfo, ShellNavItem } from "@kwim/shared-ui";
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
  return (
    <ModuleShell
      title={carwashModuleInfo.title}
      breadcrumbPath={carwashModuleInfo.breadcrumbPath}
      items={items}
      defaultSelected="dashboard"
      enableSearch
    />
  );
}

export default App;
