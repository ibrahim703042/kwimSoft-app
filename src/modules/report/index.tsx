import { createGroupedModule } from "@/core/crud/createModule";
import { BarChart3 } from "lucide-react";

export const reportModule = createGroupedModule({
  name: "report",
  label: "Reports",
  icon: BarChart3,
  basePath: "/reports",
  permission: "report.read",
  entities: [
    {
      key: "report",
      label: "Reports",
      endpoint: "/report",
      service: "transport",
      permissionPrefix: "report",
      columns: [
        { header: "Report #", accessorKey: "reportNumber" },
        { header: "Title", accessorKey: "title" },
        { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
        { header: "Period", accessorKey: "period", cell: ({ row }: any) => (row.original.period || "").toUpperCase() },
        { header: "Format", accessorKey: "format", cell: ({ row }: any) => (row.original.format || "json").toUpperCase() },
        { header: "Start", accessorKey: "startDate", cell: ({ row }: any) => row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : "—" },
        { header: "End", accessorKey: "endDate", cell: ({ row }: any) => row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : "—" },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
          const s = row.original.status;
          const colors: Record<string, string> = { pending: "text-blue-600", generating: "text-yellow-600", completed: "text-green-600", failed: "text-red-600" };
          return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
        }},
      ],
    },
  ],
});
