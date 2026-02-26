/**
 * PageHeader — Reusable page header with title, description, icon and action buttons.
 */
import { LucideIcon } from "lucide-react";
import { Button } from "@kwim/shared-ui";

export interface PageHeaderAction {
  icon?: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  show?: boolean;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: PageHeaderAction[];
}

export function PageHeader({ title, description, icon: Icon, actions = [] }: PageHeaderProps) {
  const visibleActions = actions.filter((a) => a.show !== false);

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-primary" />}
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {visibleActions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {visibleActions.map((action, index) => {
            const ActionIcon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant ?? "outline"}
                size="sm"
                className={action.variant === "default" ? "bg-[#0F123F] " + (action.className ?? "") : action.className}
                onClick={action.onClick}
              >
                {ActionIcon && <ActionIcon className="h-4 w-4 mr-2" />}
                {action.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
