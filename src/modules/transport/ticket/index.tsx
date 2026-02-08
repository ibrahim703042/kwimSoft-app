import { createGroupedModule } from "@/core/crud/createModule";
import { Ticket } from "lucide-react";

export const ticketModule = createGroupedModule({
  name: "ticket",
  label: "Tickets",
  icon: Ticket,
  basePath: "/ticketing",
  permission: "ticket.read",
  entities: [
    {
      key: "ticket",
      label: "Tickets",
      endpoint: "/ticket",
      service: "transport",
      permissionPrefix: "ticket",
      columns: [
        { header: "Ticket #", accessorKey: "ticketNumber" },
        { header: "Passenger", accessorKey: "passengerName" },
        { header: "Phone", accessorKey: "passengerPhone" },
        { header: "Seat", accessorKey: "seatNumber" },
        { header: "Price", accessorKey: "price", cell: ({ row }: any) => `${row.original.price || 0} ${row.original.currency || "CDF"}` },
        { header: "Payment", accessorKey: "paymentStatus", cell: ({ row }: any) => {
          const s = row.original.paymentStatus;
          const colors: Record<string, string> = { paid: "text-green-600", pending: "text-yellow-600", refunded: "text-blue-600", failed: "text-red-600" };
          return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
        }},
        { header: "Status", accessorKey: "status", cell: ({ row }: any) => {
          const s = row.original.status;
          const colors: Record<string, string> = { confirmed: "text-green-600", pending: "text-yellow-600", used: "text-gray-500", cancelled: "text-red-600" };
          return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").replace(/_/g, " ").toUpperCase()}</span>;
        }},
      ],
    },
  ],
});
