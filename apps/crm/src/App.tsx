import { AppLayout, type AppLayoutConfig } from "@kwim/shared-ui";
import { CrmShell } from "@kwim/modules-crm";
import { useAuthStore, toAppLayoutUser, createAuthLogoutHandler } from "@kwim/auth";
import { crmModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Crm",
    menus: crmModuleConfig.menu,
    user: toAppLayoutUser(user),
    onLogout: createAuthLogoutHandler(logout),
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <CrmShell breadcrumbPath="/" />
    </AppLayout>
  );
}

export default App;
