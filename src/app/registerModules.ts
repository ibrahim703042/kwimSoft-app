import { FrontModule } from "./ModuleRegistry";

/**
 * Register all application modules here
 */

// Import modules
import { dashboardModule } from "@/modules/dashboard";
import { userModule } from "@/modules/user";
import { driverModule } from "@/modules/driver";
import { stationModule } from "@/modules/station";
import { reservationModule } from "@/modules/reservation";
import { scheduleModule } from "@/modules/schedule";
import { administrationModule } from "@/modules/administration";

/**
 * Array of all registered modules
 */
export const modules: FrontModule[] = [
  dashboardModule,
  userModule,
  driverModule,
  stationModule,
  reservationModule,
  scheduleModule,
  administrationModule,
];

/**
 * Get all modules
 */
export const getModules = () => modules;

/**
 * Get all routes from all modules
 */
export const getAllRoutes = () => modules.flatMap((m) => m.routes);

/**
 * Get all menus from all modules
 */
export const getAllMenus = () => modules.flatMap((m) => m.menu);

/**
 * Get all permissions from all modules
 */
export const getAllPermissions = () => modules.flatMap((m) => m.permissions || []);
