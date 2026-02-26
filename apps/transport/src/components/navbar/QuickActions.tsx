import { UserPlus, Calendar, FileText, Clock, Users } from "lucide-react";
import { QuickActions as SharedQuickActions, type NavbarQuickAction } from "@kwim/shared-ui";

const quickActions: NavbarQuickAction[] = [
  {
    icon: UserPlus,
    label: "Add Employee",
    description: "Create a new employee",
    shortcut: "⌘E",
    onClick: () => console.log("Add employee"),
  },
  {
    icon: Calendar,
    label: "Request Leave",
    description: "Submit leave request",
    shortcut: "⌘L",
    onClick: () => console.log("Request leave"),
  },
  {
    icon: FileText,
    label: "New Contract",
    description: "Create employment contract",
    onClick: () => console.log("New contract"),
  },
  {
    icon: Clock,
    label: "Log Attendance",
    description: "Record attendance",
    onClick: () => console.log("Log attendance"),
  },
  {
    icon: Users,
    label: "New Department",
    description: "Create department",
    onClick: () => console.log("New department"),
  },
];

const QuickActions = () => {
  return <SharedQuickActions actions={quickActions} />;
};

export default QuickActions;
