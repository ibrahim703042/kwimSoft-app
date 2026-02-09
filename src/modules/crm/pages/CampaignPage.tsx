import { createListPage } from "@/core/crud/createModule";
import { Megaphone } from "lucide-react";

const CampaignPage = createListPage({
  key: "campaign",
  label: "Campaigns",
  endpoint: "/campaign",
  service: "hr",
  permissionPrefix: "campaign",
  icon: Megaphone,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Type", accessorKey: "type" },
    { header: "Start", accessorKey: "startDate", cell: ({ row }: any) => row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : "—" },
    { header: "End", accessorKey: "endDate", cell: ({ row }: any) => row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : "—" },
    { header: "Budget", accessorKey: "budget" },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").toUpperCase() },
  ],
});

export default CampaignPage;
