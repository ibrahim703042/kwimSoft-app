import { AppLayout, type AppLayoutConfig } from "@kwim/shared-ui";
import { FinanceShell } from "@kwim/modules-finance";
import { useAuthStore, toAppLayoutUser, createAuthLogoutHandler } from "@kwim/auth";
import { financeModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Finance",
    menus: financeModuleConfig.menu,
    user: toAppLayoutUser(user),
    onLogout: createAuthLogoutHandler(logout),
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <FinanceShell breadcrumbPath="/" />
    </AppLayout>
  );
}

export default App;
