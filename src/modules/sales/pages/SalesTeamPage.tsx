import { createListPage } from "@/core/crud/createModule";
import { Users } from "lucide-react";

const SalesTeamPage = createListPage({
  key: "sales-team",
  label: "Sales Teams",
  endpoint: "/sales-team",
  service: "stock",
  permissionPrefix: "sales_team",
  icon: Users,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Leader", accessorKey: "leader", cell: ({ row }: any) => row.original.leader?.name || "—" },
    { header: "Members", accessorKey: "memberCount" },
    { header: "Target", accessorKey: "salesTarget", cell: ({ row }: any) => `${row.original.salesTarget || 0}` },
    { header: "Achieved", accessorKey: "salesAchieved", cell: ({ row }: any) => `${row.original.salesAchieved || 0}` },
    { header: "Active", accessorKey: "isActive", cell: ({ row }: any) => row.original.isActive !== false ? "✓ Yes" : "✗ No" },
  ],
});

export default SalesTeamPage;
