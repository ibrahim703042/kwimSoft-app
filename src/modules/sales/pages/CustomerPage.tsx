import { createListPage } from "@/core/crud/createModule";
import { UserCheck } from "lucide-react";

const CustomerPage = createListPage({
  key: "customer",
  label: "Customers",
  endpoint: "/customer",
  service: "stock",
  permissionPrefix: "customer",
  icon: UserCheck,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Company", accessorKey: "company" },
    { header: "Total Orders", accessorKey: "totalOrders" },
    { header: "Total Spent", accessorKey: "totalSpent", cell: ({ row }: any) => `${row.original.totalSpent || 0}` },
    { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
  ],
});

export default CustomerPage;
