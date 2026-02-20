import { FrontModule } from "./ModuleRegistry";

/**
 * Register all application modules here
 * Organized like Odoo/QuickBooks with grouped navigation
 */

// ─── Core ─────────────────────────────────────────────────────
import { adminAreaModule } from "@/modules/admin-area";

// ─── Transport (Drivers, Vehicles, Stations, Schedules, Trips, Seats, Tickets, Reservations) ──
import { transportModule } from "@/modules/transport";

// ─── Carwash ──────────────────────────────────────────────────
import { carwashModule } from "@/modules/carwash";

// ─── Fleet Maintenance ────────────────────────────────────────
import { maintenanceModule } from "@/modules/maintenance";

// ─── Reports & Analytics ──────────────────────────────────────
import { reportModule } from "@/modules/report";

// ─── Product Management ───────────────────────────────────────
import { productModule } from "@/modules/product";

// ─── HR & People (Employees, Staff, Users, Groups, Roles, Sessions, Departments, etc.) ──
import { hrModule } from "@/modules/hr";

// ─── Inventory & Warehouse ────────────────────────────────────
import { inventoryModule } from "@/modules/inventory";

// ─── CRM ──────────────────────────────────────────────────────
import { crmModule } from "@/modules/crm";

// ─── Finance & Accounting ─────────────────────────────────────
import { financeModule } from "@/modules/finance";

// ─── Procurement ──────────────────────────────────────────────
import { procurementModule } from "@/modules/procurement";

// ─── Manufacturing ────────────────────────────────────────────
import { manufacturingModule } from "@/modules/manufacturing";

// ─── Sales ────────────────────────────────────────────────────
import { salesModule } from "@/modules/sales";

// ─── Legacy (deep-link routes only, no sidebar entries) ───────
import { userModule } from "@/modules/user";

/**
 * Array of all registered modules
 * Order determines sidebar menu order
 */
export const modules: FrontModule[] = [
  // Core (admin area: Welcome, Server info, Provider info)
  adminAreaModule,

  // Transport & Logistics
  transportModule,

  // Carwash
  carwashModule,

  // Maintenance
  maintenanceModule,

  // Reports
  reportModule,

  // Products
  productModule,

  // HR & People (replaces old Admin + User Management)
  hrModule,

  // Inventory
  inventoryModule,

  // CRM
  crmModule,

  // Finance
  financeModule,

  // Procurement
  procurementModule,

  // Manufacturing
  manufacturingModule,

  // Sales
  salesModule,

  // Legacy modules (routes only, no sidebar)
  userModule,
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
