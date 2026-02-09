import { Group, GitFork, SquareUser, BookUser } from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";
import GroupNew from "./GroupNew";
import RoleNew from "./RoleNew";
import UserNew from "./UserNew";
import UserSessionNew from "./UserSessionNew";

const items: ShellNavItem[] = [
  { key: "groupe",       label: "Groupe",       icon: Group,      component: GroupNew },
  { key: "roles",        label: "Roles",        icon: GitFork,    component: RoleNew },
  { key: "user",         label: "User",         icon: SquareUser, component: UserNew },
  { key: "user-session", label: "User session", icon: BookUser,   component: UserSessionNew },
];

export default function UserManagement() {
  return (
    <ModuleShell
      title="User Management"
      breadcrumbPath="/user-management"
      items={items}
    />
  );
}
