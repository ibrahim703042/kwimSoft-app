import { ReactNode } from "react";
import { useAuth } from "./useAuth";
import { ShieldX } from "lucide-react";

/** Default fallback shown when the user lacks the required permission */
function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-muted-foreground gap-3">
      <ShieldX className="h-12 w-12" />
      <p className="text-sm font-medium">Accès refusé</p>
      <p className="text-xs">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
    </div>
  );
}

interface CanProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  /** What to render when permission is denied. Defaults to AccessDenied message. Set to `null` to render nothing. */
  fallback?: ReactNode;
  /** If true, render nothing instead of the default AccessDenied message */
  silent?: boolean;
  children: ReactNode;
}

/**
 * Permission guard component - renders children only if user has required permission(s)
 */
export function Can({ 
  permission, 
  permissions, 
  requireAll = false, 
  fallback, 
  silent = false,
  children 
}: CanProps) {
  const auth = useAuth();

  const denied = silent ? null : (fallback !== undefined ? fallback : <AccessDenied />);

  // No permission required - render children
  if (!permission && !permissions) {
    return <>{children}</>;
  }

  // Single permission check
  if (permission) {
    return auth.hasPermission(permission) ? <>{children}</> : <>{denied}</>;
  }

  // Multiple permissions check
  if (permissions) {
    const hasAccess = requireAll 
      ? auth.hasAllPermissions(permissions)
      : auth.hasAnyPermission(permissions);
    
    return hasAccess ? <>{children}</> : <>{denied}</>;
  }

  return <>{denied}</>;
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
