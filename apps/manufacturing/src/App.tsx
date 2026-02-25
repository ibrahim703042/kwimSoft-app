import { ModuleShell, manufacturingMenuItems, manufacturingModuleInfo, ShellNavItem } from "@kwim/shared-ui";
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
  return (
    <ModuleShell
      title={manufacturingModuleInfo.title}
      breadcrumbPath={manufacturingModuleInfo.breadcrumbPath}
      items={items}
      defaultSelected="dashboard"
      enableSearch
    />
  );
}

export default App;
