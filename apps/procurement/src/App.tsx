import { ModuleShell, procurementMenuItems, procurementModuleInfo, ShellNavItem } from "@kwim/shared-ui";
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
  return (
    <ModuleShell
      title={procurementModuleInfo.title}
      breadcrumbPath={procurementModuleInfo.breadcrumbPath}
      items={items}
      defaultSelected="dashboard"
      enableSearch
    />
  );
}

export default App;
