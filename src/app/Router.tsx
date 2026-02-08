import { Routes, Route, Navigate } from "react-router-dom";
import { Can, ProtectedRoute, useAuthStore } from "@/core/auth";
import { getAllRoutes } from "./registerModules";
import Login from "@/core/auth/login/Login";
import ForgotPassword from "@/core/auth/login/ForgotPassword";
import UpdatePassword from "@/core/auth/login/UpdatePassword";
import NotFound from "@/components/others/app/NotFound";
import ProfilePage from "@/modules/account/ProfilePage";
import SettingsPage from "@/modules/account/SettingsPage";
import PageTitle from "@/components/utilitie/PageTitle";

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

      {/* Profile & Settings (protected, no permission required) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <PageTitle title="Profile" />
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <PageTitle title="Settings" />
            <SettingsPage />
          </ProtectedRoute>
        }
      />

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
