export { INVENTORY_PERMISSIONS } from "./domain/permissions";
export * from "./application/inventory.api";
export { createInventoryModule } from "./presentation/createInventoryModule";
export type { FrontModule, InventoryModuleDeps } from "./presentation/createInventoryModule";
export { default as InventoryShell } from "./presentation/InventoryShell";
