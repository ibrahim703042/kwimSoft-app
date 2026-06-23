import { AppLayout, type AppLayoutConfig } from "@kwim/shared-ui";
import { InventoryShell } from "@kwim/modules-inventory";
import { useAuthStore, toAppLayoutUser, createAuthLogoutHandler } from "@kwim/auth";
import { inventoryModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Inventory",
    menus: inventoryModuleConfig.menu,
    user: toAppLayoutUser(user),
    onLogout: createAuthLogoutHandler(logout),
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <InventoryShell breadcrumbPath="/" />
    </AppLayout>
  );
}

export default App;
