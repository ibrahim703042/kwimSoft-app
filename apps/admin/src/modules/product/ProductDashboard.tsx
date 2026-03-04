import { ModuleDashboard, createEntityApi } from "@/core/crud";
import type { DashboardConfig } from "@/core/crud";
import { Package, FolderTree, Award, AlertTriangle, Star, PackagePlus } from "lucide-react";

const productApi = createEntityApi("product", "/product");

const dashboardConfig: DashboardConfig = {
  queryKey: ["product-dashboard"],
  queryFn: () => productApi.list(),
  stats: [
    { key: "total-products", label: "Total Produits", icon: Package, color: "#3b82f6", getValue: (d) => d?.totalProducts ?? 0 },
    { key: "categories", label: "Catégories", icon: FolderTree, color: "#10b981", getValue: (d) => d?.totalCategories ?? 0 },
    { key: "brands", label: "Marques", icon: Award, color: "#f59e0b", getValue: (d) => d?.totalBrands ?? 0 },
    { key: "low-stock", label: "Stock faible", icon: AlertTriangle, color: "#ef4444", getValue: (d) => d?.lowStockCount ?? 0 },
    { key: "reviews", label: "Avis", icon: Star, color: "#8b5cf6", getValue: (d) => d?.totalReviews ?? 0 },
    { key: "bundles", label: "Lots", icon: PackagePlus, color: "#06b6d4", getValue: (d) => d?.totalBundles ?? 0 },
  ],
  charts: [
    {
      key: "products-by-status",
      title: "Produits par statut",
      type: "pie",
      dataKeys: [{ key: "value", color: "#3b82f6" }],
      nameKey: "name",
      getData: (d) => d?.productsByStatus || [],
    },
    {
      key: "products-by-category",
      title: "Produits par catégorie",
      type: "bar",
      xAxisKey: "name",
      dataKeys: [{ key: "count", color: "#10b981", label: "Produits" }],
      getData: (d) => d?.productsByCategory || [],
    },
    {
      key: "reviews-trend",
      title: "Tendance des avis",
      type: "line",
      xAxisKey: "date",
      dataKeys: [{ key: "count", color: "#8b5cf6", label: "Avis" }],
      span: 2,
      getData: (d) => d?.reviewsTrend || [],
    },
  ],
};

export default function ProductDashboard() {
  return <ModuleDashboard config={dashboardConfig} />;
}
