import { createEntityListPage } from "../createEntityListPage";
import { seatApi } from "../../../application/transport.api";

export default createEntityListPage({
  title: "Sièges",
  queryKey: "seats",
  listFn: seatApi.list,
  deleteFn: seatApi.delete,
  permissionPrefix: "seat",
  columns: [
    { header: "N° siège", accessorKey: "seatNumber" },
    {
      header: "Classe",
      accessorKey: "seatClass",
      cell: ({ row }) => String((row.original as { seatClass?: string }).seatClass ?? "").replace(/_/g, " ").toUpperCase(),
    },
    { header: "Position", accessorKey: "position" },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }) => String((row.original as { status?: string }).status ?? "").toUpperCase(),
    },
  ],
});
