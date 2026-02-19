import { FrontModule } from "@/app/ModuleRegistry";

/**
 * User module — same structure as HR module.
 * - UserShell: shell with "Gestion Utilisateurs" (tabbed view)
 * - UserTabbedView: tabs for Utilisateurs, Groupes, Rôles, Sessions
 * - pages/index: exports UserNew, GroupNew, RoleNew, UserSessionNew
 */
export const userModule: FrontModule = {
  name: "user",
  routes: [],
  menu: [],
  permissions: ["user.read", "user.create", "user.update", "user.delete"],
};

export { default as UserShell } from "./UserShell";
export { default as UserTabbedView } from "./UserTabbedView";
export { default as UserManagement } from "./pages/UserManagement";
export { UserNew, GroupNew, RoleNew, UserSessionNew } from "./pages";
