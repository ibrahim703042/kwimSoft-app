import { Button, Loading } from "@kwim/shared-ui";
import { Action } from "./types";

interface ActionBarProps {
  actions: Action[];
  className?: string;
  checkPermission?: (permission?: string) => boolean;
}

/**
 * Action bar for workflow actions
 */
export function ActionBar({ actions, className = "", checkPermission }: ActionBarProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {actions.map((action) => {
        const Icon = action.icon;
        
        if (action.permission && checkPermission && !checkPermission(action.permission)) {
          return null;
        }
        
        return (
          <Button
            key={action.id}
            variant={action.variant || "default"}
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
          >
            {action.loading ? (
              <div className="flex items-center gap-2">
                <Loading loading={true} size={20} />
                <span>{action.label}</span>
              </div>
            ) : (
              <>
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {action.label}
              </>
            )}
          </Button>
        );
      })}
    </div>
  );
}
