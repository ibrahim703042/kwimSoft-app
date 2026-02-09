import { createListPage } from "@/core/crud/createModule";
import { Repeat } from "lucide-react";

const TransferPage = createListPage({
  key: "transfer",
  label: "Transfers",
  endpoint: "/transfer",
  service: "stock",
  permissionPrefix: "transfer",
  icon: Repeat,
  columns: [
    { header: "Reference", accessorKey: "reference" },
    { header: "From", accessorKey: "sourceWarehouse", cell: ({ row }: any) => row.original.sourceWarehouse?.name || "—" },
    { header: "To", accessorKey: "destinationWarehouse", cell: ({ row }: any) => row.original.destinationWarehouse?.name || "—" },
    { header: "Items", accessorKey: "items", cell: ({ row }: any) => row.original.items?.length || 0 },
    { header: "Date", accessorKey: "date", cell: ({ row }: any) => row.original.date ? new Date(row.original.date).toLocaleDateString() : "—" },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").replace(/_/g, " ").toUpperCase() },
  ],
});

export default TransferPage;
