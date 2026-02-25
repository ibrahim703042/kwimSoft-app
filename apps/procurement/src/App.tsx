import { AppShell } from "@kwim/shared-ui";
import { procurementModuleConfig } from "@/config/module.config";
import { useLocation, NavLink } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  const location = useLocation();

  return (
    <AppShell
      menus={procurementModuleConfig.menu}
      quickActions={procurementModuleConfig.quickActions}
      currentPath={location.pathname}
      isAuthenticated={true}
      LinkComponent={NavLink}
      breadcrumbs={
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Procurement</span>
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
