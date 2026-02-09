import { createListPage } from "@/core/crud/createModule";
import { BarChart3 } from "lucide-react";

const StockLevelPage = createListPage({
  key: "stock",
  label: "Stock Levels",
  endpoint: "/stock",
  service: "stock",
  permissionPrefix: "stock",
  icon: BarChart3,
  columns: [
    { header: "Product", accessorKey: "product", cell: ({ row }: any) => row.original.product?.name || "—" },
    { header: "Warehouse", accessorKey: "warehouse", cell: ({ row }: any) => row.original.warehouse?.name || "—" },
    { header: "Quantity", accessorKey: "quantity" },
    { header: "Reserved", accessorKey: "reservedQuantity" },
    { header: "Available", accessorKey: "availableQuantity" },
  ],
});

export default StockLevelPage;
