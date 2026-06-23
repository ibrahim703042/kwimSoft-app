import { AppLayout, type AppLayoutConfig } from "@kwim/shared-ui";
import { HrAppRoutes } from "@kwim/modules-hr";
import { useAuthStore, toAppLayoutUser, createAuthLogoutHandler } from "@kwim/auth";
import { hrModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const config: AppLayoutConfig = {
    appName: "KwimSoft HR",
    menus: hrModuleConfig.menu,
    user: toAppLayoutUser(user),
    onLogout: createAuthLogoutHandler(logout),
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <HrAppRoutes />
    </AppLayout>
  );
}

export default App;
