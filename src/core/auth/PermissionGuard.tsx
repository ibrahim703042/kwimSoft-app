import { ReactNode } from "react";
import { useAuth } from "./useAuth";

interface CanProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Permission guard component - renders children only if user has required permission(s)
 * 
 * @example
 * // Single permission
 * <Can permission="driver.read">
 *   <DriverList />
 * </Can>
 * 
 * @example
 * // Multiple permissions (any)
 * <Can permissions={["driver.read", "driver.admin"]}>
 *   <DriverList />
 * </Can>
 * 
 * @example
 * // Multiple permissions (all required)
 * <Can permissions={["driver.read", "driver.update"]} requireAll>
 *   <EditDriver />
 * </Can>
 */
export function Can({ 
  permission, 
  permissions, 
  requireAll = false, 
  fallback = null, 
  children 
}: CanProps) {
  const auth = useAuth();

  // No permission required - render children
  if (!permission && !permissions) {
    return <>{children}</>;
  }

  // Single permission check
  if (permission) {
    return auth.hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
  }

  // Multiple permissions check
  if (permissions) {
    const hasAccess = requireAll 
      ? auth.hasAllPermissions(permissions)
      : auth.hasAnyPermission(permissions);
    
    return hasAccess ? <>{children}</> : <>{fallback}</>;
  }

  return <>{fallback}</>;
}

/**
 * Hook version for conditional logic in components
 */
export const useCan = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();
  
  return {
    can: hasPermission,
    canAny: hasAnyPermission,
    canAll: hasAllPermissions,
  };
};
