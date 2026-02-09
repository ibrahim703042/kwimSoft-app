import { createListPage } from "@/core/crud/createModule";
import { MapPin } from "lucide-react";

const LocationPage = createListPage({
  key: "location",
  label: "Locations",
  endpoint: "/location",
  service: "stock",
  permissionPrefix: "location",
  icon: MapPin,
  columns: [
    { header: "Name", accessorKey: "name" },
    { header: "Code", accessorKey: "code" },
    { header: "Warehouse", accessorKey: "warehouse", cell: ({ row }: any) => row.original.warehouse?.name || "—" },
    { header: "Type", accessorKey: "type" },
  ],
});

export default LocationPage;
