import { AppLayout, type AppLayoutConfig } from "@kwim/shared-ui";
import { TransportShell } from "@kwim/modules-transport";
import { useAuthStore, toAppLayoutUser, createAuthLogoutHandler } from "@kwim/auth";
import { transportModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";
import { Route, MapPin, Users, Ticket, Calendar } from "lucide-react";

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Transport",
    menus: transportModuleConfig.menu,
    user: toAppLayoutUser(user),
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
    onLogout: createAuthLogoutHandler(logout),
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <TransportShell
        title="Transport"
        breadcrumbPath="/"
        enableSearch
      />
    </AppLayout>
  );
}

export default App;
