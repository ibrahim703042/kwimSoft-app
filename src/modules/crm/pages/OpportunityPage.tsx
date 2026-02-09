import { createListPage } from "@/core/crud/createModule";
import { Lightbulb } from "lucide-react";

const OpportunityPage = createListPage({
  key: "opportunity",
  label: "Opportunities",
  endpoint: "/opportunity",
  service: "hr",
  permissionPrefix: "opportunity",
  icon: Lightbulb,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Contact", accessorKey: "contact", cell: ({ row }: any) => row.original.contact?.name || "—" },
    { header: "Value", accessorKey: "expectedRevenue", cell: ({ row }: any) => `${row.original.expectedRevenue || 0}` },
    { header: "Probability", accessorKey: "probability", cell: ({ row }: any) => `${row.original.probability || 0}%` },
    { header: "Close Date", accessorKey: "expectedCloseDate", cell: ({ row }: any) => row.original.expectedCloseDate ? new Date(row.original.expectedCloseDate).toLocaleDateString() : "—" },
    { header: "Stage", accessorKey: "stage", cell: ({ row }: any) => (row.original.stage || "").replace(/_/g, " ").toUpperCase() },
  ],
});

export default OpportunityPage;
