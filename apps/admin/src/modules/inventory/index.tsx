/**
 * Inventory module — thin shim to @kwim/modules-inventory
 */
import { createInventoryModule } from "@kwim/modules-inventory";
import PageTitle from "@/components/utilitie/PageTitle";

export const inventoryModule = createInventoryModule({ PageTitle });

export { INVENTORY_PERMISSIONS } from "@kwim/modules-inventory";
export * from "@kwim/modules-inventory";
