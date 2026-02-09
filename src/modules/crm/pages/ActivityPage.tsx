import { createListPage } from "@/core/crud/createModule";
import { CalendarCheck } from "lucide-react";

const ActivityPage = createListPage({
  key: "activity",
  label: "Activities",
  endpoint: "/activity",
  service: "hr",
  permissionPrefix: "activity",
  icon: CalendarCheck,
  columns: [
    { header: "Subject", accessorKey: "subject" },
    { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
    { header: "Due Date", accessorKey: "dueDate", cell: ({ row }: any) => row.original.dueDate ? new Date(row.original.dueDate).toLocaleDateString() : "—" },
    { header: "Assigned To", accessorKey: "assignedTo" },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => (row.original.status || "").toUpperCase() },
  ],
});

export default ActivityPage;
