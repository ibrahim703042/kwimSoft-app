import { AppLayout, type AppLayoutConfig } from "@kwim/shared-ui";
import { CarwashShell } from "@kwim/modules-carwash";
import { useAuthStore, toAppLayoutUser, createAuthLogoutHandler } from "@kwim/auth";
import { carwashModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Carwash",
    menus: carwashModuleConfig.menu,
    user: toAppLayoutUser(user),
    onLogout: createAuthLogoutHandler(logout),
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <CarwashShell breadcrumbPath="/" />
    </AppLayout>
  );
}

export default App;
