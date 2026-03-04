import { ModuleDashboard, createEntityApi } from "@/core/crud";
import type { DashboardConfig } from "@/core/crud";
import { Wrench, ClipboardCheck, AlertTriangle, DollarSign } from "lucide-react";

const maintenanceApi = createEntityApi("transport", "/maintenance-request");

const dashboardConfig: DashboardConfig = {
  queryKey: ["maintenance-dashboard"],
  queryFn: () => maintenanceApi.list(),
  stats: [
    { key: "active-orders", label: "Ordres actifs", icon: Wrench, color: "#3b82f6", getValue: (d) => d?.activeOrders ?? 0 },
    { key: "inspections", label: "Inspections", icon: ClipboardCheck, color: "#10b981", getValue: (d) => d?.totalInspections ?? 0 },
    { key: "overdue", label: "En retard", icon: AlertTriangle, color: "#ef4444", getValue: (d) => d?.overdueCount ?? 0 },
    { key: "total-cost", label: "Coût total", icon: DollarSign, color: "#f59e0b", getValue: (d) => d?.totalCost ?? 0 },
  ],
  charts: [
    {
      key: "orders-by-priority",
      title: "Ordres par priorité",
      type: "bar",
      xAxisKey: "name",
      dataKeys: [{ key: "count", color: "#3b82f6", label: "Ordres" }],
      getData: (d) => d?.ordersByPriority || [],
    },
    {
      key: "inspection-results",
      title: "Résultats des inspections",
      type: "pie",
      dataKeys: [{ key: "value", color: "#10b981" }],
      nameKey: "name",
      getData: (d) => d?.inspectionResults || [],
    },
  ],
};

export default function MaintenanceDashboard() {
  return <ModuleDashboard config={dashboardConfig} />;
}
