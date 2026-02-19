import { useAuthStore } from "./auth.store";
import { User } from "./types";

export const useAuth = () => {
  const { user, isAuthenticated, permissions, setUser, logout, setPermissions } = useAuthStore();

  const login = (userData: User) => {
    setUser(userData);
  };

  /**
   * Check if the current user is a super admin (bypasses all permission checks).
   * Returns true when the permissions array contains the wildcard "*"
   * (injected at login time by buildPermissions in auth.store).
   */
  const isSuperAdmin = (): boolean => {
    if (!user) return false;
    return permissions.includes("*");
  };

  const hasPermission = (permission: string): boolean => {
    if (!permission) return true;
    if (isSuperAdmin()) return true;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    if (isSuperAdmin()) return true;
    return requiredPermissions.some((p) => permissions.includes(p));
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    if (isSuperAdmin()) return true;
    return requiredPermissions.every((p) => permissions.includes(p));
  };

  return {
    user,
    isAuthenticated,
    permissions,
    login,
    logout,
    setPermissions,
    isSuperAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    entrepriseId: user?.entrepriseId,
    etablissementId: user?.etablissementId,
  };
};
