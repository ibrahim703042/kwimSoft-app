import { createGroupedModule } from "@/core/crud";
import { Navigation } from "lucide-react";

export const tripModule = createGroupedModule({
  name: "trip",
  label: "Trips",
  icon: Navigation,
  basePath: "/operations",
  permission: "trip.read",
  entities: [
    {
      key: "trip",
      label: "Trips",
      endpoint: "/trip",
      service: "transport",
      permissionPrefix: "trip",
      columns: [
        { header: "Trip #", accessorKey: "tripNumber" },
        { header: "Mode", accessorKey: "transportMode", cell: ({ row }: any) => (row.original.transportMode || "bus").toUpperCase() },
        { header: "Departure", accessorKey: "scheduledDepartureTime", cell: ({ row }: any) => row.original.scheduledDepartureTime ? new Date(row.original.scheduledDepartureTime).toLocaleString() : "N/A" },
        { header: "Arrival", accessorKey: "scheduledArrivalTime", cell: ({ row }: any) => row.original.scheduledArrivalTime ? new Date(row.original.scheduledArrivalTime).toLocaleString() : "N/A" },
        { header: "Seats", accessorKey: "totalSeats" },
        { header: "Booked", accessorKey: "bookedSeats" },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
          const s = row.original.status;
          const colors: Record<string, string> = { scheduled: "text-blue-600", boarding: "text-yellow-600", in_progress: "text-green-600", completed: "text-gray-500", cancelled: "text-red-600", delayed: "text-orange-600" };
          return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").replace(/_/g, " ").toUpperCase()}</span>;
        }},
      ],
    },
  ],
});
