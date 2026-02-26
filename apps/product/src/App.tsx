import { AppLayout, type AppLayoutConfig, ModuleShell, productMenuItems, productModuleInfo, ShellNavItem } from "@kwim/shared-ui";
import { productModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";
import { Package, FolderTree, Tag, Layers, Bookmark, DollarSign } from "lucide-react";
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
  const navigate = useNavigate();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Products",
    menus: productModuleConfig.menu,
    user: {
      fullName: "Product User",
      email: "product@kwimsoft.com",
      role: "Product Manager",
    },
    quickActions: [
      {
        icon: Package,
        label: "Nouveau produit",
        description: "Créer un produit",
        shortcut: "⌘N",
        onClick: () => navigate("/products/new"),
      },
      {
        icon: FolderTree,
        label: "Catégorie",
        description: "Créer une catégorie",
        onClick: () => navigate("/categories/new"),
      },
      {
        icon: Tag,
        label: "Marque",
        description: "Ajouter une marque",
        onClick: () => navigate("/brands/new"),
      },
      {
        icon: Layers,
        label: "Attribut",
        description: "Créer un attribut",
        onClick: () => navigate("/attributes/new"),
      },
      {
        icon: DollarSign,
        label: "Tarification",
        description: "Gérer les prix",
        onClick: () => navigate("/pricing"),
      },
    ],
    notifications: [
      {
        id: "1",
        title: "Produit ajouté",
        message: "Un nouveau produit a été ajouté au catalogue",
        type: "success",
        time: "8 min ago",
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
        title={productModuleInfo.title}
        breadcrumbPath={productModuleInfo.breadcrumbPath}
        items={items}
        defaultSelected="dashboard"
        enableSearch
      />
    </AppLayout>
  );
}

export default App;
