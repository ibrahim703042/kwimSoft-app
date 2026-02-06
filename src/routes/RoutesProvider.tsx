import { Route, Routes } from "react-router-dom";
import { ModuleRegistry } from "@/app/ModuleRegistry";
import Dashboard from "../modules/dashbord/Dashboard";
import NotFound from "@/components/others/app/NotFound";
import PageTitle from "@/components/utilitie/PageTitle";
import Login from "@/core/auth/login/Login";

export default function RoutesProvider() {
  const moduleRoutes = ModuleRegistry.getAllRoutes();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Dashboard" />
            <Dashboard />
          </>
        }
      />

      {/* Module routes */}
      {moduleRoutes.map((route, index) => (
        <Route
          key={route.path || `route-${index}`}
          path={route.path}
          element={route.element}
          index={route.index}
        />
      ))}

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
