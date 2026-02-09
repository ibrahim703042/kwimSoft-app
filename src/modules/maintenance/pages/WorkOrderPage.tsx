import { createListPage } from "@/core/crud/createModule";
import { Wrench } from "lucide-react";

const WorkOrderPage = createListPage({
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
});

export default WorkOrderPage;
