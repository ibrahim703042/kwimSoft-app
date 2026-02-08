import { createGroupedModule } from "@/core/crud/createModule";
import { Bus, Train, Ship, Truck } from "lucide-react";

export const vehicleModule = createGroupedModule({
  name: "vehicle",
  label: "Vehicles",
  icon: Truck,
  basePath: "/fleet",
  permission: "vehicle.read",
  entities: [
    {
      key: "vehicle",
      label: "Vehicles",
      endpoint: "/vehicle",
      service: "transport",
      permissionPrefix: "vehicle",
      columns: [
        { header: "Reg. Number", accessorKey: "registrationNumber" },
        { header: "Brand", accessorKey: "brand" },
        { header: "Model", accessorKey: "model" },
        { header: "Type", accessorKey: "type", cell: ({ row }: any) => (row.original.type || "").replace(/_/g, " ").toUpperCase() },
        { header: "Mode", accessorKey: "transportMode", cell: ({ row }: any) => (row.original.transportMode || "bus").toUpperCase() },
        { header: "Seats", accessorKey: "seatCapacity" },
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
          const s = row.original.status;
          const color = s === "active" ? "text-green-600" : s === "in_maintenance" ? "text-yellow-600" : "text-red-600";
          return <span className={`font-medium ${color}`}>{(s || "").replace(/_/g, " ").toUpperCase()}</span>;
        }},
      ],
    },
  ],
});
