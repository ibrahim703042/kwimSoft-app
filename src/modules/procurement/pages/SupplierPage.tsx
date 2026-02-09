import { createListPage } from "@/core/crud/createModule";
import { Truck } from "lucide-react";

const SupplierPage = createListPage({
  key: "supplier",
  label: "Suppliers",
  endpoint: "/supplier",
  service: "stock",
  permissionPrefix: "supplier",
  icon: Truck,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Code", accessorKey: "code" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Country", accessorKey: "country" },
    { header: "Rating", accessorKey: "rating", cell: ({ row }: any) => row.original.rating ? `${row.original.rating}/5` : "—" },
    { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
  ],
});

export default SupplierPage;
