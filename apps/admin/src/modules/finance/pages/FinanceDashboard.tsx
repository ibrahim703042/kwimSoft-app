import { ModuleDashboard, createEntityApi } from "@/core/crud";
import type { DashboardConfig } from "@/core/crud";
import {
  DollarSign,
  FileText,
  CreditCard,
  PiggyBank,
  AlertTriangle,
  Calculator,
} from "lucide-react";

const financeApi = createEntityApi("stock", "/finance");

const dashboardConfig: DashboardConfig = {
  queryKey: ["finance-dashboard"],
  queryFn: () => financeApi.list(),
  stats: [
    {
      key: "revenue",
      label: "Revenus",
      icon: DollarSign,
      color: "#10b981",
      getValue: (d) => d?.totalRevenue ?? 0,
    },
    {
      key: "invoices",
      label: "Factures",
      icon: FileText,
      color: "#3b82f6",
      getValue: (d) => d?.totalInvoices ?? 0,
    },
    {
      key: "payments",
      label: "Paiements",
      icon: CreditCard,
      color: "#8b5cf6",
      getValue: (d) => d?.totalPayments ?? 0,
    },
    {
      key: "budget-used",
      label: "Budget utilisé",
      icon: PiggyBank,
      color: "#f59e0b",
      getValue: (d) => d?.budgetUsed ?? 0,
    },
    {
      key: "overdue",
      label: "En retard",
      icon: AlertTriangle,
      color: "#ef4444",
      getValue: (d) => d?.overdueCount ?? 0,
    },
    {
      key: "tax-collected",
      label: "Taxes collectées",
      icon: Calculator,
      color: "#06b6d4",
      getValue: (d) => d?.taxCollected ?? 0,
    },
  ],
  charts: [
    {
      key: "revenue-vs-expenses",
      title: "Revenus vs Dépenses",
      type: "bar",
      xAxisKey: "month",
      dataKeys: [
        { key: "revenue", color: "#10b981", label: "Revenus" },
        { key: "expenses", color: "#ef4444", label: "Dépenses" },
      ],
      getData: (d) =>
        d?.revenueVsExpenses || [
          { month: "Jan", revenue: 0, expenses: 0 },
          { month: "Fév", revenue: 0, expenses: 0 },
          { month: "Mar", revenue: 0, expenses: 0 },
          { month: "Avr", revenue: 0, expenses: 0 },
        ],
    },
    {
      key: "invoice-status",
      title: "Répartition des factures par statut",
      type: "pie",
      dataKeys: [{ key: "value", color: "#3b82f6" }],
      nameKey: "name",
      getData: (d) =>
        d?.invoiceStatusBreakdown || [
          { name: "Brouillon", value: 0 },
          { name: "Envoyée", value: 0 },
          { name: "Payée", value: 0 },
          { name: "En retard", value: 0 },
        ],
    },
    {
      key: "payment-trend",
      title: "Tendance des paiements (30j)",
      type: "area",
      xAxisKey: "date",
      dataKeys: [
        { key: "incoming", color: "#10b981", label: "Entrants" },
        { key: "outgoing", color: "#ef4444", label: "Sortants" },
      ],
      span: 2,
      getData: (d) => d?.paymentTrend || [],
    },
  ],
};

export default function FinanceDashboard() {
  return <ModuleDashboard config={dashboardConfig} />;
}
