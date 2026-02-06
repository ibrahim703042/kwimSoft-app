import { Routes, Route } from "react-router-dom";
import { Can } from "@/core/auth";
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

  return (
    <Routes>
      {/* Dynamic routes from modules */}
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
            element={element}
            index={route.index}
          />
        );
      })}

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
