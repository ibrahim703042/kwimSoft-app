import { ModuleShell, salesMenuItems, salesModuleInfo, ShellNavItem } from "@kwim/shared-ui";
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
  return (
    <ModuleShell
      title={salesModuleInfo.title}
      breadcrumbPath={salesModuleInfo.breadcrumbPath}
      items={items}
      defaultSelected="dashboard"
      enableSearch
    />
  );
}

export default App;
