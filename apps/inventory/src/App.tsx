import { AppShell } from "@kwim/shared-ui";
import { inventoryModuleConfig } from "@/config/module.config";
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  const location = useLocation();

  return (
    <AppShell
      menus={inventoryModuleConfig.menu}
      quickActions={inventoryModuleConfig.quickActions}
      currentPath={location.pathname}
      isAuthenticated={true}
      breadcrumbs={
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Inventory</span>
          <span className="text-gray-400">/</span>
          <span className="font-medium">Dashboard</span>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </AppShell>
  );
}

export default App;
