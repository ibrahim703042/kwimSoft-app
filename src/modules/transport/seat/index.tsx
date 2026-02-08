import { createGroupedModule } from "@/core/crud/createModule";
import { Armchair } from "lucide-react";

export const seatModule = createGroupedModule({
  name: "seat",
  label: "Seats",
  icon: Armchair,
  basePath: "/seating",
  permission: "seat.read",
  entities: [
    {
      key: "seat",
      label: "Seats",
      endpoint: "/seat",
      service: "transport",
      permissionPrefix: "seat",
      columns: [
        { header: "Seat #", accessorKey: "seatNumber" },
        { header: "Class", accessorKey: "seatClass", cell: ({ row }: any) => (row.original.seatClass || "").replace(/_/g, " ").toUpperCase() },
        { header: "Position", accessorKey: "position" },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
          const s = row.original.status;
          const colors: Record<string, string> = { available: "text-green-600", reserved: "text-yellow-600", booked: "text-blue-600", blocked: "text-red-600" };
          return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
        }},
      ],
    },
  ],
});
