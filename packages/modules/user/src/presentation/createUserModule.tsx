import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { USER_PERMISSIONS } from "../domain/permissions";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

export function createUserModule(): FrontModule {
  return {
    name: "user",
    routes: [] as AppRoute[],
    menu: [] as MenuItem[],
    permissions: [...USER_PERMISSIONS],
  };
}
