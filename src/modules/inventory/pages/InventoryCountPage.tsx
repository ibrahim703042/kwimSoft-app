import { createListPage } from "@/core/crud/createModule";
import { ClipboardCheck } from "lucide-react";

const InventoryCountPage = createListPage({
  key: "inventory-count",
  label: "Inventory Counts",
  endpoint: "/inventory-count",
  service: "stock",
  permissionPrefix: "inventory_count",
  icon: ClipboardCheck,
  columns: [
    { header: "Reference", accessorKey: "reference" },
    { header: "Warehouse", accessorKey: "warehouse", cell: ({ row }: any) => row.original.warehouse?.name || "—" },
    { header: "Date", accessorKey: "date", cell: ({ row }: any) => row.original.date ? new Date(row.original.date).toLocaleDateString() : "—" },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").replace(/_/g, " ").toUpperCase() },
  ],
});

export default InventoryCountPage;
