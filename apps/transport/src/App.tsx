import { ModuleShell, transportMenuItems, transportModuleInfo, ShellNavItem } from "@kwim/shared-ui";
import { Dashboard, createPlaceholderPage } from "./pages";

const DriversPage = createPlaceholderPage("Conducteurs", "Gérer les conducteurs");
const VehiclesPage = createPlaceholderPage("Véhicules", "Gérer les véhicules");
const StationsPage = createPlaceholderPage("Gares", "Gérer les gares");
const SchedulesPage = createPlaceholderPage("Horaires", "Gérer les horaires");
const TripsPage = createPlaceholderPage("Voyages", "Gérer les voyages");
const SeatsPage = createPlaceholderPage("Sièges", "Gérer les sièges");
const TicketsPage = createPlaceholderPage("Billets", "Gérer les billets");
const ReservationsPage = createPlaceholderPage("Réservations", "Gérer les réservations");

const pageComponents: Record<string, React.ComponentType> = {
  "dashboard": Dashboard,
  "drivers": DriversPage,
  "vehicles": VehiclesPage,
  "stations": StationsPage,
  "schedules": SchedulesPage,
  "trips": TripsPage,
  "seats": SeatsPage,
  "tickets": TicketsPage,
  "reservations": ReservationsPage,
};

const items: ShellNavItem[] = transportMenuItems.map((item) => ({
  ...item,
  component: pageComponents[item.key] || Dashboard,
}));

function App() {
  return (
    <ModuleShell
      title={transportModuleInfo.title}
      breadcrumbPath={transportModuleInfo.breadcrumbPath}
      items={items}
      defaultSelected="dashboard"
      enableSearch
    />
  );
}

export default App;
