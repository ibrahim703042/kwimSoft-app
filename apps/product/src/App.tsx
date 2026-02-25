import { ModuleShell, productMenuItems, productModuleInfo, ShellNavItem } from "@kwim/shared-ui";
import { Dashboard, createPlaceholderPage } from "./pages";

const CategoriesPage = createPlaceholderPage("Catégories", "Gérer les catégories");
const SubCategoriesPage = createPlaceholderPage("Sous-catégories", "Gérer les sous-catégories");
const BrandsPage = createPlaceholderPage("Marques", "Gérer les marques");
const ProductsPage = createPlaceholderPage("Produits", "Gérer les produits");
const AttributesPage = createPlaceholderPage("Attributs", "Gérer les attributs");
const TagsPage = createPlaceholderPage("Étiquettes", "Gérer les étiquettes");
const BundlesPage = createPlaceholderPage("Lots", "Gérer les lots");
const PricingPage = createPlaceholderPage("Tarification", "Gérer la tarification");
const ReviewsPage = createPlaceholderPage("Avis", "Gérer les avis clients");

const pageComponents: Record<string, React.ComponentType> = {
  "dashboard": Dashboard,
  "categories": CategoriesPage,
  "sub-categories": SubCategoriesPage,
  "brands": BrandsPage,
  "products": ProductsPage,
  "attributes": AttributesPage,
  "tags": TagsPage,
  "bundles": BundlesPage,
  "pricing": PricingPage,
  "reviews": ReviewsPage,
};

const items: ShellNavItem[] = productMenuItems.map((item) => ({
  ...item,
  component: pageComponents[item.key] || Dashboard,
}));

function App() {
  return (
    <ModuleShell
      title={productModuleInfo.title}
      breadcrumbPath={productModuleInfo.breadcrumbPath}
      items={items}
      defaultSelected="dashboard"
      enableSearch
    />
  );
}

export default App;
