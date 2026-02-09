import { createListPage } from "@/core/crud/createModule";
import { Warehouse } from "lucide-react";

const BayPage = createListPage({
  key: "bay",
  label: "Bays",
  endpoint: "/bay",
  service: "transport",
  permissionPrefix: "bay",
  icon: Warehouse,
  columns: [
    { header: "Code", accessorKey: "code" },
    { header: "Name", accessorKey: "name" },
    { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
    { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
      const s = row.original.status;
      const colors: Record<string, string> = { available: "text-green-600", occupied: "text-yellow-600", maintenance: "text-orange-600", out_of_order: "text-red-600" };
      return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").replace(/_/g, " ").toUpperCase()}</span>;
    }},
  ],
});

export default BayPage;
