import { FrontModule } from "@/app/ModuleRegistry";

/**
 * User module — no longer has a sidebar entry.
 * Users, Groups, Roles, and Sessions are now managed inside the HR module.
 * This module is kept for backward compatibility (if any deep links exist).
 */
export const userModule: FrontModule = {
  name: "user",
  routes: [], // All routes now handled by HR module
  menu: [],   // No sidebar entry
  permissions: ["user.read", "user.create", "user.update", "user.delete"],
};
