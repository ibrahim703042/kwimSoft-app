import { ModuleDashboard, DashboardConfig } from "@/core/crud/ModuleDashboard";
import { createEntityApi } from "@/core/crud/createModule";
import { Factory, Wrench, ClipboardCheck, Timer, AlertTriangle, CheckCircle } from "lucide-react";

const manufacturingApi = createEntityApi("stock", "/manufacturing");

const dashboardConfig: DashboardConfig = {
  queryKey: ["manufacturing-dashboard"],
  queryFn: () => manufacturingApi.list(),
  stats: [
    { key: "orders", label: "Ordres de fabrication", icon: Factory, color: "#3b82f6", getValue: (d) => d?.totalOrders ?? 0 },
    { key: "inProgress", label: "En cours", icon: Timer, color: "#f59e0b", getValue: (d) => d?.inProgress ?? 0 },
    { key: "completed", label: "Terminés", icon: CheckCircle, color: "#10b981", getValue: (d) => d?.completed ?? 0 },
    { key: "workCenters", label: "Postes de travail", icon: Wrench, color: "#8b5cf6", getValue: (d) => d?.totalWorkCenters ?? 0 },
    { key: "quality", label: "Contrôles qualité", icon: ClipboardCheck, color: "#06b6d4", getValue: (d) => d?.qualityChecks ?? 0 },
    { key: "issues", label: "Alertes", icon: AlertTriangle, color: "#ef4444", getValue: (d) => d?.issues ?? 0 },
  ],
  charts: [
    {
      key: "orders-by-status",
      title: "Ordres par statut",
      type: "pie",
      dataKeys: [{ key: "value", color: "#3b82f6" }],
      nameKey: "name",
      getData: (d) => d?.ordersByStatus || [],
    },
    {
      key: "monthly-production",
      title: "Production mensuelle",
      type: "bar",
      xAxisKey: "month",
      dataKeys: [
        { key: "planned", color: "#3b82f6", label: "Planifié" },
        { key: "actual", color: "#10b981", label: "Réalisé" },
      ],
      getData: (d) => d?.monthlyProduction || [],
    },
    {
      key: "workcenter-utilization",
      title: "Utilisation postes de travail",
      type: "bar",
      xAxisKey: "name",
      dataKeys: [{ key: "utilization", color: "#8b5cf6", label: "%" }],
      getData: (d) => d?.workCenterUtilization || [],
    },
  ],
};

export default function ManufacturingDashboard() {
  return <ModuleDashboard config={dashboardConfig} />;
}
