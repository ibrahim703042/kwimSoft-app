import {
  FolderTree, Layers, Award, Box,
  SlidersHorizontal, Tag, PackagePlus, BadgeDollarSign, Star,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";

import {
  CategoryPage,
  SubCategoryPage,
  BrandPage,
  ProductListPage,
  AttributePage,
  TagPage,
  BundlePage,
  PricingPage,
  ReviewPage,
} from "./pages";

const items: ShellNavItem[] = [
  { key: "categories",     label: "Catégories",       icon: FolderTree,        component: CategoryPage },
  { key: "sub-categories", label: "Sous-catégories",  icon: Layers,            component: SubCategoryPage },
  { key: "brands",         label: "Marques",          icon: Award,             component: BrandPage },
  { key: "products",       label: "Produits",         icon: Box,               component: ProductListPage },
  { key: "attributes",     label: "Attributs",        icon: SlidersHorizontal, component: AttributePage },
  { key: "tags",           label: "Étiquettes",       icon: Tag,               component: TagPage },
  { key: "bundles",        label: "Lots",             icon: PackagePlus,       component: BundlePage },
  { key: "pricing",        label: "Tarification",     icon: BadgeDollarSign,   component: PricingPage },
  { key: "reviews",        label: "Avis",             icon: Star,              component: ReviewPage },
];

export default function ProductShell() {
  return (
    <ModuleShell
      title="Produits"
      breadcrumbPath="/products"
      items={items}
      enableSearch
    />
  );
}
