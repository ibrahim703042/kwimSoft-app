import { createListPage } from "@/core/crud/createModule";
import { PiggyBank } from "lucide-react";

const BudgetPage = createListPage({
  key: "budget",
  label: "Budgets",
  endpoint: "/budget",
  service: "stock",
  permissionPrefix: "budget",
  icon: PiggyBank,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Period", accessorKey: "period" },
    { header: "Planned", accessorKey: "plannedAmount", cell: ({ row }: any) => `${row.original.plannedAmount || 0}` },
    { header: "Actual", accessorKey: "actualAmount", cell: ({ row }: any) => `${row.original.actualAmount || 0}` },
    { header: "Remaining", accessorKey: "remainingAmount", cell: ({ row }: any) => `${row.original.remainingAmount || 0}` },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").toUpperCase() },
  ],
});

export default BudgetPage;
