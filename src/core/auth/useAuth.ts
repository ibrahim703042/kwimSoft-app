import { useAuthStore } from "./auth.store";
import { User } from "./types";

export const useAuth = () => {
  const { user, isAuthenticated, permissions, setUser, logout, setPermissions } = useAuthStore();

  const login = (userData: User) => {
    setUser(userData);
  };

  const hasPermission = (permission: string): boolean => {
    if (!permission) return true;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission => permissions.includes(permission));
  };

  return {
    user,
    isAuthenticated,
    permissions,
    login,
    logout,
    setPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    entrepriseId: user?.entrepriseId,
    etablissementId: user?.etablissementId,
  };
};
