import {
  UserCheck, Truck, MapPin, Calendar, Navigation,
  Armchair, Ticket, BookOpen,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";

// ── Real pages (with custom implementations) ──────────────────
import DriverListPage from "@/modules/transport/driver/pages/DriverListPage";
import Gare from "@/modules/transport/gare/Gare";
import Reservation from "@/modules/transport/reservation/Reservation";
import Horaire from "@/modules/transport/horaires/Horaire";

// ── Generated CrudPages for entities without custom pages ─────
import { createListPage } from "@/core/crud/createModule";

const VehiclePage = createListPage({
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
    {
      header: "Status", accessorKey: "status", cell: ({ row }: any) => {
        const s = row.original.status;
        const color = s === "active" ? "text-green-600" : s === "in_maintenance" ? "text-yellow-600" : "text-red-600";
        return <span className={`font-medium ${color}`}>{(s || "").replace(/_/g, " ").toUpperCase()}</span>;
      },
    },
  ],
});

const TripPage = createListPage({
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
    {
      header: "Status", accessorKey: "status", cell: ({ row }: any) => {
        const s = row.original.status;
        const colors: Record<string, string> = { scheduled: "text-blue-600", boarding: "text-yellow-600", in_progress: "text-green-600", completed: "text-gray-500", cancelled: "text-red-600", delayed: "text-orange-600" };
        return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").replace(/_/g, " ").toUpperCase()}</span>;
      },
    },
  ],
});

const SeatPage = createListPage({
  key: "seat",
  label: "Seats",
  endpoint: "/seat",
  service: "transport",
  permissionPrefix: "seat",
  columns: [
    { header: "Seat #", accessorKey: "seatNumber" },
    { header: "Class", accessorKey: "seatClass", cell: ({ row }: any) => (row.original.seatClass || "").replace(/_/g, " ").toUpperCase() },
    { header: "Position", accessorKey: "position" },
    {
      header: "Status", accessorKey: "status", cell: ({ row }: any) => {
        const s = row.original.status;
        const colors: Record<string, string> = { available: "text-green-600", reserved: "text-yellow-600", booked: "text-blue-600", blocked: "text-red-600" };
        return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
      },
    },
  ],
});

const TicketPage = createListPage({
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
    {
      header: "Payment", accessorKey: "paymentStatus", cell: ({ row }: any) => {
        const s = row.original.paymentStatus;
        const colors: Record<string, string> = { paid: "text-green-600", pending: "text-yellow-600", refunded: "text-blue-600", failed: "text-red-600" };
        return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").toUpperCase()}</span>;
      },
    },
    {
      header: "Status", accessorKey: "status", cell: ({ row }: any) => {
        const s = row.original.status;
        const colors: Record<string, string> = { confirmed: "text-green-600", pending: "text-yellow-600", used: "text-gray-500", cancelled: "text-red-600" };
        return <span className={`font-medium ${colors[s] || ""}`}>{(s || "").replace(/_/g, " ").toUpperCase()}</span>;
      },
    },
  ],
});

// ── Shell sidebar items ───────────────────────────────────────
const items: ShellNavItem[] = [
  { key: "drivers",      label: "Drivers",      icon: UserCheck,   component: DriverListPage },
  { key: "vehicles",     label: "Vehicles",     icon: Truck,       component: VehiclePage },
  { key: "stations",     label: "Stations",     icon: MapPin,      component: Gare },
  { key: "schedules",    label: "Schedules",    icon: Calendar,    component: Horaire },
  { key: "trips",        label: "Trips",        icon: Navigation,  component: TripPage },
  { key: "seats",        label: "Seats",        icon: Armchair,    component: SeatPage },
  { key: "tickets",      label: "Tickets",      icon: Ticket,      component: TicketPage },
  { key: "reservations", label: "Reservations", icon: BookOpen,    component: Reservation },
];

export default function TransportShell() {
  return (
    <ModuleShell
      title="Transport"
      breadcrumbPath="/transport"
      items={items}
      enableSearch
    />
  );
}
