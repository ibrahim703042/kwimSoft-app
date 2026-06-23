import { AppLayout, type AppLayoutConfig } from "@kwim/shared-ui";
import { ProcurementShell } from "@kwim/modules-procurement";
import { useAuthStore, toAppLayoutUser, createAuthLogoutHandler } from "@kwim/auth";
import { procurementModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Procurement",
    menus: procurementModuleConfig.menu,
    user: toAppLayoutUser(user),
    onLogout: createAuthLogoutHandler(logout),
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <ProcurementShell breadcrumbPath="/" />
    </AppLayout>
  );
}

export default App;
