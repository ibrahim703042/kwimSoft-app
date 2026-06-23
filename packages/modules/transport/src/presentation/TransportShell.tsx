import {
  UserCheck,
  Truck,
  MapPin,
  Calendar,
  Navigation,
  Armchair,
  Ticket,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";
import { ModuleShell, type ShellNavItem } from "@kwim/shared-ui";
import { ModuleDashboard } from "@kwim/shared-ui";
import DriverListPage from "./pages/drivers/DriverListPage";
import StationsPage from "./pages/stations/StationsPage";
import SchedulesPage from "./pages/horaires/SchedulesPage";
import ReservationPage from "./pages/reservations/ReservationPage";
import VehiclesPage from "./pages/vehicles/VehiclesPage";
import TripsPage from "./pages/trips/TripsPage";
import SeatsPage from "./pages/seats/SeatsPage";
import TicketsPage from "./pages/tickets/TicketsPage";

export interface TransportShellProps {
  readonly title?: string;
  readonly breadcrumbPath?: string;
  readonly enableSearch?: boolean;
}

const shellItems: ShellNavItem[] = [
  {
    key: "dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    component: () => (
      <ModuleDashboard
        title="Transport Dashboard"
        description="Gérez vos opérations de transport"
        welcomeTitle="Bienvenue dans Transport"
        welcomeMessage="Planifiez voyages, gares, conducteurs et billets depuis ce module."
      />
    ),
  },
  { key: "drivers", label: "Conducteurs", icon: UserCheck, component: DriverListPage },
  { key: "vehicles", label: "Véhicules", icon: Truck, component: VehiclesPage },
  { key: "stations", label: "Gares", icon: MapPin, component: StationsPage },
  { key: "schedules", label: "Horaires", icon: Calendar, component: SchedulesPage },
  { key: "trips", label: "Voyages", icon: Navigation, component: TripsPage },
  { key: "seats", label: "Sièges", icon: Armchair, component: SeatsPage },
  { key: "tickets", label: "Billets", icon: Ticket, component: TicketsPage },
  { key: "reservations", label: "Réservations", icon: BookOpen, component: ReservationPage },
];

export default function TransportShell({
  title = "Transport",
  breadcrumbPath = "/transport",
  enableSearch = true,
}: TransportShellProps) {
  return (
    <ModuleShell
      title={title}
      breadcrumbPath={breadcrumbPath}
      items={shellItems}
      defaultSelected="dashboard"
      enableSearch={enableSearch}
    />
  );
}
