import { ModuleDashboard, DashboardConfig } from "@/core/crud/ModuleDashboard";
import { createEntityApi } from "@/core/crud/createModule";
import { Truck, ShoppingCart, Clock, PackageCheck } from "lucide-react";

const procurementApi = createEntityApi("stock", "/procurement");

const dashboardConfig: DashboardConfig = {
  queryKey: ["procurement-dashboard"],
  queryFn: () => procurementApi.list(),
  stats: [
    { key: "suppliers", label: "Fournisseurs", icon: Truck, color: "#3b82f6", getValue: (d) => d?.totalSuppliers ?? 0 },
    { key: "orders", label: "Commandes", icon: ShoppingCart, color: "#10b981", getValue: (d) => d?.totalOrders ?? 0 },
    { key: "pending", label: "En attente", icon: Clock, color: "#f59e0b", getValue: (d) => d?.pendingOrders ?? 0 },
    { key: "receipts", label: "Réceptions", icon: PackageCheck, color: "#8b5cf6", getValue: (d) => d?.totalReceipts ?? 0 },
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
      key: "monthly-spending",
      title: "Dépenses mensuelles",
      type: "bar",
      xAxisKey: "month",
      dataKeys: [{ key: "amount", color: "#10b981", label: "Montant" }],
      getData: (d) => d?.monthlySpending || [],
    },
  ],
};

export default function ProcurementDashboard() {
  return <ModuleDashboard config={dashboardConfig} />;
}
