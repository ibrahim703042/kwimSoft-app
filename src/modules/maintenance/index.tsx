import { createGroupedModule } from "@/core/crud/createModule";
import { Wrench, ClipboardCheck } from "lucide-react";

export const maintenanceModule = createGroupedModule({
  name: "maintenance",
  label: "Maintenance",
  icon: Wrench,
  basePath: "/maintenance",
  permission: "maintenance.read",
  entities: [
    {
      key: "request",
      label: "Work Orders",
      endpoint: "/maintenance-request",
      service: "transport",
      permissionPrefix: "maintenance",
      icon: Wrench,
      columns: [
        { header: "Request #", accessorKey: "requestNumber" },
        { header: "Title", accessorKey: "title" },
        { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
        { header: "Priority", accessorKey: "priority", cell: ({ row }: any) => {
          const p = row.original.priority;
          const colors: Record<string, string> = { low: "text-gray-600", medium: "text-blue-600", high: "text-orange-600", critical: "text-red-600", emergency: "text-red-800 font-bold" };
          return <span className={colors[p] || ""}>{(p || "").toUpperCase()}</span>;
        }},
        { header: "Scheduled", accessorKey: "scheduledDate", cell: ({ row }: any) => row.original.scheduledDate ? new Date(row.original.scheduledDate).toLocaleDateString() : "—" },
        { header: "Cost", accessorKey: "totalCost", cell: ({ row }: any) => `${row.original.totalCost || 0} ${row.original.currency || "CDF"}` },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
          const s = row.original.status;
          const colors: Record<string, string> = { requested: "text-blue-600", scheduled: "text-indigo-600", in_progress: "text-yellow-600", completed: "text-green-600", cancelled: "text-red-600", overdue: "text-red-800" };
          return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").replace(/_/g, " ").toUpperCase()}</span>;
        }},
      ],
    },
    {
      key: "inspection",
      label: "Inspections",
      endpoint: "/inspection",
      service: "transport",
      permissionPrefix: "inspection",
      icon: ClipboardCheck,
      columns: [
        { header: "Inspection #", accessorKey: "inspectionNumber" },
        { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
        { header: "Inspector", accessorKey: "inspectorName" },
        { header: "Date", accessorKey: "inspectionDate", cell: ({ row }: any) => row.original.inspectionDate ? new Date(row.original.inspectionDate).toLocaleDateString() : "—" },
        { header: "Score", accessorKey: "overallScore", cell: ({ row }: any) => {
          const score = row.original.overallScore;
          if (score == null) return "—";
          const color = score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";
          return <span className={`font-bold ${color}`}>{score}/100</span>;
        }},
        { header: "Result", accessorKey: "result", cell: ({ row }: any) => {
          const r = row.original.result;
          const colors: Record<string, string> = { pass: "text-green-600", fail: "text-red-600", conditional_pass: "text-yellow-600", pending_review: "text-blue-600" };
          return <span className={`font-medium ${colors[r] || ""}`}>{(r || "pending").replace(/_/g, " ").toUpperCase()}</span>;
        }},
        { header: "Next Due", accessorKey: "nextInspectionDate", cell: ({ row }: any) => row.original.nextInspectionDate ? new Date(row.original.nextInspectionDate).toLocaleDateString() : "—" },
      ],
    },
  ],
});
