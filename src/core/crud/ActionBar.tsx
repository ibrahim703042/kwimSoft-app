import { Button } from "@/components/ui/button";
import { Can } from "@/core/auth";
import { Action } from "./types";
import Loading from "@/components/utilitie/Loading";

interface ActionBarProps {
  actions: Action[];
  className?: string;
}

/**
 * Action bar for workflow actions with permission guards
 */
export function ActionBar({ actions, className = "" }: ActionBarProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {actions.map((action) => {
        const Icon = action.icon;
        
        return (
          <Can key={action.id} permission={action.permission}>
            <Button
              variant={action.variant || "default"}
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
            >
              {action.loading ? (
                <div className="flex items-center gap-2">
                  <Loading loading={true} />
                  <span>{action.label}</span>
                </div>
              ) : (
                <>
                  {Icon && <Icon className="h-4 w-4 mr-2" />}
                  {action.label}
                </>
              )}
            </Button>
          </Can>
        );
      })}
    </div>
  );
}
