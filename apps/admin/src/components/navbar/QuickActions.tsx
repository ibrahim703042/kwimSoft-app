import React from "react";
import {
  Plus,
  FileText,
  Users,
  FolderPlus,
  Mail,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

interface QuickAction {
  icon: React.ElementType;
  label: string;
  description?: string;
  shortcut?: string;
  onClick: () => void;
}

const quickActions: QuickAction[] = [
  {
    icon: FileText,
    label: "New Document",
    description: "Create a new document",
    shortcut: "⌘N",
    onClick: () => console.log("New document"),
  },
  {
    icon: Users,
    label: "Add User",
    description: "Invite a team member",
    shortcut: "⌘U",
    onClick: () => console.log("Add user"),
  },
  {
    icon: FolderPlus,
    label: "New Project",
    description: "Start a new project",
    onClick: () => console.log("New project"),
  },
  {
    icon: Mail,
    label: "Send Message",
    description: "Compose a message",
    shortcut: "⌘M",
    onClick: () => console.log("Send message"),
  },
  {
    icon: Calendar,
    label: "Schedule Event",
    description: "Add to calendar",
    onClick: () => console.log("Schedule event"),
  },
];

const QuickActions: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm">
          <Plus size={16} />
          <span className="hidden sm:inline">Create</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {quickActions.map((action) => (
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
