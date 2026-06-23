import { createUserModule } from "@kwim/modules-user";

export const userModule = createUserModule();

export {
  UserShell,
  UserTabbedView,
  UserManagement,
  UserNew,
  GroupNew,
  RoleNew,
  UserSessionNew,
  USER_PERMISSIONS,
} from "@kwim/modules-user";
