import { FrontModule } from "./ModuleRegistry";

/**
 * Register all application modules here
 * Organized like Odoo/QuickBooks with grouped navigation
 */

// ─── Core Modules ─────────────────────────────────────────────
import { dashboardModule } from "@/modules/dashboard";
import { userModule } from "@/modules/user";
import { administrationModule } from "@/modules/administration";

// ─── Transport & Logistics ────────────────────────────────────
import { driverModule } from "@/modules/transports/driver";
import { stationModule } from "@/modules/transports/station";
import { reservationModule } from "@/modules/transports/reservation";
import { scheduleModule } from "@/modules/transports/schedule";
import { vehicleModule } from "@/modules/transport/vehicle";
import { tripModule } from "@/modules/transport/trip";
import { ticketModule } from "@/modules/transport/ticket";
import { seatModule } from "@/modules/transport/seat";

// ─── Carwash ──────────────────────────────────────────────────
import { carwashModule } from "@/modules/carwash";

// ─── Fleet Maintenance ────────────────────────────────────────
import { maintenanceModule } from "@/modules/maintenance";

// ─── Reports & Analytics ──────────────────────────────────────
import { reportModule } from "@/modules/report";

// ─── Product Management ───────────────────────────────────────
import { productModule } from "@/modules/product";

// ─── Human Resources ──────────────────────────────────────────
import { hrModule } from "@/modules/hr";

// ─── Inventory & Warehouse ────────────────────────────────────
import { inventoryModule } from "@/modules/inventory";

// ─── CRM ──────────────────────────────────────────────────────
import { crmModule } from "@/modules/crm";

// ─── Finance & Accounting ─────────────────────────────────────
import { financeModule } from "@/modules/finance";

// ─── Procurement ──────────────────────────────────────────────
import { procurementModule } from "@/modules/procurement";

// ─── Sales ────────────────────────────────────────────────────
import { salesModule } from "@/modules/sales";

/**
 * Array of all registered modules
 * Order determines sidebar menu order
 */
export const modules: FrontModule[] = [
  // Core
  dashboardModule,
  
  // Transport & Logistics (grouped in sidebar)
  driverModule,
  vehicleModule,
  stationModule,
  scheduleModule,
  tripModule,
  seatModule,
  ticketModule,
  reservationModule,

  // Carwash
  carwashModule,

  // Maintenance
  maintenanceModule,

  // Reports
  reportModule,

  // Products
  productModule,

  // HR
  hrModule,

  // Inventory
  inventoryModule,

  // CRM
  crmModule,

  // Finance
  financeModule,

  // Procurement
  procurementModule,

  // Sales
  salesModule,

  // User & Admin (bottom of sidebar)
  userModule,
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
