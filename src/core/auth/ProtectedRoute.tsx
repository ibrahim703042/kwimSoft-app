import { Navigate } from "react-router-dom";
import { useAuthStore } from "./auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Component that protects routes requiring authentication
 * Redirects to login if user is not authenticated
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
    // return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
