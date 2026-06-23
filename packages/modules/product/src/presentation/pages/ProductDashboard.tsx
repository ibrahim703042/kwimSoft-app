import { ModuleDashboard } from "@kwim/core";
import type { DashboardConfig } from "@kwim/core";
import { Box, FolderTree, Award, Star } from "lucide-react";
import { productApi } from "../../application/product.api";

const dashboardConfig: DashboardConfig = {
  queryKey: ["product-dashboard"],
  queryFn: () => productApi.list(),
  stats: [
    { key: "products", label: "Produits", icon: Box, color: "#3b82f6", getValue: (d) => d?.totalProducts ?? 0 },
    { key: "categories", label: "Catégories", icon: FolderTree, color: "#10b981", getValue: (d) => d?.totalCategories ?? 0 },
    { key: "brands", label: "Marques", icon: Award, color: "#f59e0b", getValue: (d) => d?.totalBrands ?? 0 },
    { key: "reviews", label: "Avis", icon: Star, color: "#8b5cf6", getValue: (d) => d?.totalReviews ?? 0 },
  ],
  charts: [],
};

export default function ProductDashboard() {
  return <ModuleDashboard config={dashboardConfig} />;
}
