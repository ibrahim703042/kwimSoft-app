import { createListPage } from "@/core/crud/createModule";
import { Landmark } from "lucide-react";

const AccountPage = createListPage({
  key: "account",
  label: "Accounts",
  endpoint: "/account",
  service: "stock",
  permissionPrefix: "account",
  icon: Landmark,
  columns: [
    { header: "Code", accessorKey: "code" },
    { header: "Name", accessorKey: "name" },
    { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
    { header: "Balance", accessorKey: "balance", cell: ({ row }: any) => `${row.original.balance || 0} ${row.original.currency || "CDF"}` },
    { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
  ],
});

export default AccountPage;
