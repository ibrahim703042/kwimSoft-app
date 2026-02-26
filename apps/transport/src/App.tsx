import { AppLayout, type AppLayoutConfig, ModuleShell, transportMenuItems, transportModuleInfo, ShellNavItem } from "@kwim/shared-ui";
import { transportModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";
import { Truck, Route, MapPin, Users, Ticket, Calendar } from "lucide-react";
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
  const navigate = useNavigate();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Transport",
    menus: transportModuleConfig.menu,
    user: {
      fullName: "Transport User",
      email: "transport@kwimsoft.com",
      role: "Transport Manager",
    },
    quickActions: [
      {
        icon: Route,
        label: "Nouveau voyage",
        description: "Planifier un nouveau voyage",
        shortcut: "⌘N",
        onClick: () => navigate("/trips/new"),
      },
      {
        icon: Ticket,
        label: "Nouveau billet",
        description: "Émettre un billet",
        onClick: () => navigate("/tickets/new"),
      },
      {
        icon: Users,
        label: "Conducteurs",
        description: "Gérer les conducteurs",
        onClick: () => navigate("/drivers"),
      },
      {
        icon: MapPin,
        label: "Gares",
        description: "Gérer les gares",
        onClick: () => navigate("/stations"),
      },
      {
        icon: Calendar,
        label: "Horaires",
        description: "Planifier les horaires",
        onClick: () => navigate("/schedules"),
      },
    ],
    notifications: [
      {
        id: "1",
        title: "Voyage confirmé",
        message: "Le voyage #123 a été confirmé",
        type: "success",
        time: "5 min ago",
        read: false,
      },
    ],
    onLogout: () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <ModuleShell
        title={transportModuleInfo.title}
        breadcrumbPath={transportModuleInfo.breadcrumbPath}
        items={items}
        defaultSelected="dashboard"
        enableSearch
      />
    </AppLayout>
  );
}

export default App;
