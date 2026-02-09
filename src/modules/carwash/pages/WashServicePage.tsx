import { createListPage } from "@/core/crud/createModule";
import { Droplets } from "lucide-react";

const WashServicePage = createListPage({
  key: "wash-service",
  label: "Wash Services",
  endpoint: "/wash-service",
  service: "transport",
  permissionPrefix: "wash_service",
  icon: Droplets,
  columns: [
    { header: "Code", accessorKey: "code" },
    { header: "Name", accessorKey: "name" },
    { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
    { header: "Price", accessorKey: "price", cell: ({ row }: any) => `${row.original.price || 0} ${row.original.currency || "CDF"}` },
    { header: "Duration (min)", accessorKey: "estimatedDurationMinutes" },
    { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive ? "✓ Yes" : "✗ No" },
  ],
});

export default WashServicePage;
