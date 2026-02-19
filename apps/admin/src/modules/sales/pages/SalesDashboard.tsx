import { ModuleDashboard, DashboardConfig } from "@/core/crud/ModuleDashboard";
import { createEntityApi } from "@/core/crud/createModule";
import { UserCheck, ShoppingBag, FileText, TrendingUp, Users } from "lucide-react";

const salesApi = createEntityApi("stock", "/sales");

const dashboardConfig: DashboardConfig = {
  queryKey: ["sales-dashboard"],
  queryFn: () => salesApi.list(),
  stats: [
    { key: "customers", label: "Clients", icon: UserCheck, color: "#3b82f6", getValue: (d) => d?.totalCustomers ?? 0 },
    { key: "orders", label: "Commandes", icon: ShoppingBag, color: "#10b981", getValue: (d) => d?.totalOrders ?? 0 },
    { key: "quotations", label: "Devis", icon: FileText, color: "#f59e0b", getValue: (d) => d?.totalQuotations ?? 0 },
    { key: "revenue", label: "Chiffre d'affaires", icon: TrendingUp, color: "#8b5cf6", getValue: (d) => d?.totalRevenue ?? 0 },
    { key: "teams", label: "Équipes", icon: Users, color: "#06b6d4", getValue: (d) => d?.totalTeams ?? 0 },
  ],
  charts: [
    {
      key: "sales-by-month",
      title: "Ventes par mois",
      type: "area",
      xAxisKey: "month",
      dataKeys: [{ key: "amount", color: "#3b82f6", label: "Montant" }],
      span: 2,
      getData: (d) => d?.salesByMonth || [],
    },
    {
      key: "orders-by-status",
      title: "Commandes par statut",
      type: "pie",
      dataKeys: [{ key: "value", color: "#10b981" }],
      nameKey: "name",
      getData: (d) => d?.ordersByStatus || [],
    },
  ],
};

export default function SalesDashboard() {
  return <ModuleDashboard config={dashboardConfig} />;
}
