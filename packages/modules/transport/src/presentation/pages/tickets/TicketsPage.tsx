import { createEntityListPage } from "../createEntityListPage";
import { ticketApi } from "../../../application/transport.api";

export default createEntityListPage({
  title: "Billets",
  queryKey: "tickets",
  listFn: ticketApi.list,
  deleteFn: ticketApi.delete,
  permissionPrefix: "ticket",
  columns: [
    { header: "N° billet", accessorKey: "ticketNumber" },
    { header: "Passager", accessorKey: "passengerName" },
    { header: "Téléphone", accessorKey: "passengerPhone" },
    { header: "Siège", accessorKey: "seatNumber" },
    {
      header: "Prix",
      accessorKey: "price",
      cell: ({ row }) => {
        const r = row.original as { price?: number; currency?: string };
        return `${r.price ?? 0} ${r.currency ?? "CDF"}`;
      },
    },
    {
      header: "Paiement",
      accessorKey: "paymentStatus",
      cell: ({ row }) => String((row.original as { paymentStatus?: string }).paymentStatus ?? "").toUpperCase(),
    },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }) => String((row.original as { status?: string }).status ?? "").replace(/_/g, " ").toUpperCase(),
    },
  ],
});
