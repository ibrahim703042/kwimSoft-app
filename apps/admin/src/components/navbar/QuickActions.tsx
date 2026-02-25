import { FileText, Users, FolderPlus, Mail, Calendar } from "lucide-react";
import { QuickActions as SharedQuickActions, type NavbarQuickAction } from "@kwim/shared-ui";

const quickActions: NavbarQuickAction[] = [
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

const QuickActions = () => {
  return <SharedQuickActions actions={quickActions} />;
};

export default QuickActions;
