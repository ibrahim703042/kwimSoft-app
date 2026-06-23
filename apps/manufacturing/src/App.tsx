import { AppLayout, type AppLayoutConfig } from "@kwim/shared-ui";
import { ManufacturingShell } from "@kwim/modules-manufacturing";
import { useAuthStore, toAppLayoutUser, createAuthLogoutHandler } from "@kwim/auth";
import { manufacturingModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Manufacturing",
    menus: manufacturingModuleConfig.menu,
    user: toAppLayoutUser(user),
    onLogout: createAuthLogoutHandler(logout),
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <ManufacturingShell breadcrumbPath="/" />
    </AppLayout>
  );
}

export default App;
