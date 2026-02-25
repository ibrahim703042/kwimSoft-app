import React from "react";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "../ui/dropdown-menu";

export interface QuickAction {
  icon: React.ElementType;
  label: string;
  description?: string;
  shortcut?: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  buttonLabel?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  actions = [],
  buttonLabel = "Create",
}) => {
  if (actions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm">
          <Plus size={16} />
          <span className="hidden sm:inline">{buttonLabel}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            onClick={action.onClick}
            className="flex items-center gap-2 cursor-pointer py-2"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted">
              <action.icon size={14} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{action.label}</p>
              {action.description && (
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              )}
            </div>
            {action.shortcut && (
              <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuickActions;
