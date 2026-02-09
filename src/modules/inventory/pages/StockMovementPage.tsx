import { createListPage } from "@/core/crud/createModule";
import { ArrowLeftRight } from "lucide-react";

const StockMovementPage = createListPage({
  key: "stock-movement",
  label: "Stock Movements",
  endpoint: "/stock-movement",
  service: "stock",
  permissionPrefix: "stock_movement",
  icon: ArrowLeftRight,
  columns: [
    { header: "Reference", accessorKey: "reference" },
    { header: "Product", accessorKey: "product", cell: ({ row }: any) => row.original.product?.name || "—" },
    { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
    { header: "Quantity", accessorKey: "quantity" },
    { header: "From", accessorKey: "sourceLocation", cell: ({ row }: any) => row.original.sourceLocation?.name || "—" },
    { header: "To", accessorKey: "destinationLocation", cell: ({ row }: any) => row.original.destinationLocation?.name || "—" },
    { header: "Date", accessorKey: "date", cell: ({ row }: any) => row.original.date ? new Date(row.original.date).toLocaleDateString() : "—" },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").replace(/_/g, " ").toUpperCase() },
  ],
});

export default StockMovementPage;
