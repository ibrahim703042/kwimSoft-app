import { createEntityListPage } from "../createEntityListPage";
import { tripApi } from "../../../application/transport.api";

export default createEntityListPage({
  title: "Voyages",
  queryKey: "trips",
  listFn: tripApi.list,
  deleteFn: tripApi.delete,
  permissionPrefix: "trip",
  columns: [
    { header: "N° voyage", accessorKey: "tripNumber" },
    {
      header: "Mode",
      accessorKey: "transportMode",
      cell: ({ row }) => String((row.original as { transportMode?: string }).transportMode ?? "bus").toUpperCase(),
    },
    {
      header: "Départ",
      accessorKey: "scheduledDepartureTime",
      cell: ({ row }) => {
        const v = (row.original as { scheduledDepartureTime?: string }).scheduledDepartureTime;
        return v ? new Date(v).toLocaleString() : "N/A";
      },
    },
    {
      header: "Arrivée",
      accessorKey: "scheduledArrivalTime",
      cell: ({ row }) => {
        const v = (row.original as { scheduledArrivalTime?: string }).scheduledArrivalTime;
        return v ? new Date(v).toLocaleString() : "N/A";
      },
    },
    { header: "Sièges", accessorKey: "totalSeats" },
    { header: "Réservés", accessorKey: "bookedSeats" },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }) => String((row.original as { status?: string }).status ?? "").replace(/_/g, " ").toUpperCase(),
    },
  ],
});
