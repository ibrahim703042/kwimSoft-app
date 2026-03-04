import { ModuleDashboard, createEntityApi } from "@/core/crud";
import type { DashboardConfig } from "@/core/crud";
import { Warehouse, MapPin, BarChart3, ArrowLeftRight, Repeat, ClipboardCheck } from "lucide-react";

const stockApi = createEntityApi("stock", "/stock");

const dashboardConfig: DashboardConfig = {
  queryKey: ["inventory-dashboard"],
  queryFn: () => stockApi.list(),
  stats: [
    { key: "warehouses", label: "Entrepôts", icon: Warehouse, color: "#3b82f6", getValue: (d) => d?.totalWarehouses ?? 0 },
    { key: "locations", label: "Emplacements", icon: MapPin, color: "#10b981", getValue: (d) => d?.totalLocations ?? 0 },
    { key: "stock-items", label: "Articles en stock", icon: BarChart3, color: "#f59e0b", getValue: (d) => d?.totalStockItems ?? 0 },
    { key: "movements", label: "Mouvements", icon: ArrowLeftRight, color: "#8b5cf6", getValue: (d) => d?.totalMovements ?? 0 },
    { key: "transfers", label: "Transferts", icon: Repeat, color: "#06b6d4", getValue: (d) => d?.totalTransfers ?? 0 },
    { key: "counts", label: "Inventaires", icon: ClipboardCheck, color: "#ef4444", getValue: (d) => d?.totalCounts ?? 0 },
  ],
  charts: [
    {
      key: "movements-by-type",
      title: "Mouvements par type",
      type: "bar",
      xAxisKey: "type",
      dataKeys: [{ key: "count", color: "#3b82f6", label: "Quantité" }],
      getData: (d) => d?.movementsByType || [
        { type: "Entrée", count: 0 },
        { type: "Sortie", count: 0 },
        { type: "Interne", count: 0 },
        { type: "Ajustement", count: 0 },
      ],
    },
    {
      key: "stock-by-warehouse",
      title: "Stock par entrepôt",
      type: "pie",
      dataKeys: [{ key: "value", color: "#10b981" }],
      nameKey: "name",
      getData: (d) => d?.stockByWarehouse || [],
    },
    {
      key: "movements-trend",
      title: "Tendance des mouvements (30j)",
      type: "area",
      xAxisKey: "date",
      dataKeys: [
        { key: "inbound", color: "#10b981", label: "Entrées" },
        { key: "outbound", color: "#ef4444", label: "Sorties" },
      ],
      span: 2,
      getData: (d) => d?.movementsTrend || [],
    },
  ],
};

export default function InventoryDashboard() {
  return <ModuleDashboard config={dashboardConfig} />;
}
