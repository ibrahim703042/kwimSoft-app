import { createListPage } from "@/core/crud/createModule";
import { Target } from "lucide-react";

const LeadPage = createListPage({
  key: "lead",
  label: "Leads",
  endpoint: "/lead",
  service: "hr",
  permissionPrefix: "lead",
  icon: Target,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Contact", accessorKey: "contact", cell: ({ row }: any) => row.original.contact?.name || "—" },
    { header: "Source", accessorKey: "source" },
    { header: "Value", accessorKey: "estimatedValue", cell: ({ row }: any) => `${row.original.estimatedValue || 0}` },
    { header: "Stage", accessorKey: "stage", cell: ({ row }: any) => (row.original.stage || "").replace(/_/g, " ").toUpperCase() },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").toUpperCase() },
  ],
});

export default LeadPage;
