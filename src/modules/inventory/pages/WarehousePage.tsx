import { createListPage } from "@/core/crud/createModule";
import { Warehouse } from "lucide-react";

const WarehousePage = createListPage({
  key: "warehouse",
  label: "Warehouses",
  endpoint: "/warehouse",
  service: "stock",
  permissionPrefix: "warehouse",
  icon: Warehouse,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Code", accessorKey: "code" },
    { header: "Address", accessorKey: "address", cell: ({ row }: any) => row.original.address?.city || row.original.address || "—" },
    { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
  ],
});

export default WarehousePage;
