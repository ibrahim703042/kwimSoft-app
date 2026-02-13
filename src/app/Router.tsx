import { lazy, Suspense } from "react";
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

// Lazy-load public pages
const LandingPage = lazy(() => import("@/pages/landing/LandingPage"));
const TrialPage = lazy(() => import("@/pages/landing/TrialPage"));
const Register = lazy(() => import("@/pages/landing/Register"));
const ThankYouPage = lazy(() => import("@/pages/landing/ThankYouPage"));
const CreateEnterprise = lazy(() => import("@/pages/landing/CreateEnterprise"));
const InviteUsersPage = lazy(() => import("@/pages/landing/InviteUsersPage"));
const WelcomePage = lazy(() => import("@/pages/landing/WelcomePage"));

/** Minimal loading fallback for lazy pages */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}

/**
 * Dynamic router that builds routes from registered modules
 */
export function AppRouter() {
  const routes = getAllRoutes();
  const { isAuthenticated } = useAuthStore();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public landing page — shown when not authenticated */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
        />

        {/* Public trial page with module selection */}
        <Route
          path="/trial"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <TrialPage />}
        />

        {/* Public registration page */}
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Thank you page after registration */}
        <Route path="/thanks/trial" element={<ThankYouPage />} />

        {/* Invite users activation page */}
        <Route path="/odoo-enterprise/invite-users" element={<InviteUsersPage />} />

        {/* Welcome/onboarding page (protected) */}
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          }
        />

        {/* Legacy enterprise creation route */}
        <Route
          path="/create-enterprise"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <CreateEnterprise />}
        />

        {/* Public auth routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
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
    </Suspense>
  );
}
