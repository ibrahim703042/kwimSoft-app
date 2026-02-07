import { Routes, Route, Navigate } from "react-router-dom";
import { Can, ProtectedRoute, useAuthStore } from "@/core/auth";
import { getAllRoutes } from "./registerModules";
import Login from "@/core/auth/login/Login";
import ForgotPassword from "@/core/auth/login/ForgotPassword";
import UpdatePassword from "@/core/auth/login/UpdatePassword";
import NotFound from "@/components/others/app/NotFound";

/**
 * Dynamic router that builds routes from registered modules
 */
export function AppRouter() {
  const routes = getAllRoutes();
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public auth routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />

      {/* Protected dynamic routes from modules */}
      {routes.map((route) => {
        const element = route.permission ? (
          <Can permission={route.permission}>{route.element}</Can>
        ) : (
          route.element
        );

        return (
          <Route
            key={route.path}
            path={route.path}
            element={<ProtectedRoute>{element}</ProtectedRoute>}
            index={route.index}
          />
        );
      })}

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
