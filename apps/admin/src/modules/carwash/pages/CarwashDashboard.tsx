import { ModuleDashboard, createEntityApi } from "@/core/crud";
import type { DashboardConfig } from "@/core/crud";
import { Droplets, Warehouse, ShoppingCart, DollarSign } from "lucide-react";

const carwashApi = createEntityApi("transport", "/wash-order");

const dashboardConfig: DashboardConfig = {
  queryKey: ["carwash-dashboard"],
  queryFn: () => carwashApi.list(),
  stats: [
    { key: "services", label: "Services", icon: Droplets, color: "#3b82f6", getValue: (d) => d?.totalServices ?? 0 },
    { key: "bays", label: "Baies", icon: Warehouse, color: "#10b981", getValue: (d) => d?.totalBays ?? 0 },
    { key: "orders-today", label: "Commandes aujourd'hui", icon: ShoppingCart, color: "#f59e0b", getValue: (d) => d?.ordersToday ?? 0 },
    { key: "revenue", label: "Revenus", icon: DollarSign, color: "#8b5cf6", getValue: (d) => d?.totalRevenue ?? 0 },
  ],
  charts: [
    {
      key: "orders-by-status",
      title: "Commandes par statut",
      type: "pie",
      dataKeys: [{ key: "value", color: "#3b82f6" }],
      nameKey: "name",
      getData: (d) => d?.ordersByStatus || [],
    },
    {
      key: "revenue-trend",
      title: "Tendance des revenus",
      type: "area",
      xAxisKey: "date",
      dataKeys: [{ key: "amount", color: "#8b5cf6", label: "Revenus" }],
      getData: (d) => d?.revenueTrend || [],
    },
  ],
};

export default function CarwashDashboard() {
  return <ModuleDashboard config={dashboardConfig} />;
}
