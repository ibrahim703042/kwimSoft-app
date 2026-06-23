import { createEntityListPage } from "../createEntityListPage";
import { vehicleApi } from "../../../application/transport.api";

function getVehicleStatusColor(status: string): string {
  if (status === "active") return "text-green-600";
  if (status === "in_maintenance") return "text-yellow-600";
  return "text-destructive";
}

export default createEntityListPage<{
  _id: string;
  registrationNumber?: string;
  brand?: string;
  model?: string;
  type?: string;
  transportMode?: string;
  seatCapacity?: number;
  status?: string;
}>({
  title: "Véhicules",
  queryKey: "vehicles",
  listFn: vehicleApi.list,
  deleteFn: vehicleApi.delete,
  permissionPrefix: "vehicle",
  columns: [
    { header: "Immatriculation", accessorKey: "registrationNumber" },
    { header: "Marque", accessorKey: "brand" },
    { header: "Modèle", accessorKey: "model" },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => String(row.original.type ?? "").replace(/_/g, " ").toUpperCase(),
    },
    {
      header: "Mode",
      accessorKey: "transportMode",
      cell: ({ row }) => String((row.original as { transportMode?: string }).transportMode ?? "bus").toUpperCase(),
    },
    { header: "Sièges", accessorKey: "seatCapacity" },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }) => {
        const s = String((row.original as { status?: string }).status ?? "");
        const color = getVehicleStatusColor(s);
        return <span className={`font-medium ${color}`}>{s.replace(/_/g, " ").toUpperCase()}</span>;
      },
    },
  ],
});
