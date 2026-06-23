/**
 * Maintenance module — thin shim to @kwim/modules-maintenance
 */
import { createMaintenanceModule } from "@kwim/modules-maintenance";
import PageTitle from "@/components/utilitie/PageTitle";

export const maintenanceModule = createMaintenanceModule({ PageTitle });

export { MAINTENANCE_PERMISSIONS } from "@kwim/modules-maintenance";
export * from "@kwim/modules-maintenance";
