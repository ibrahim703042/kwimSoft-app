export { MANUFACTURING_PERMISSIONS } from "./domain/permissions";
export * from "./application/manufacturing.api";
export { createManufacturingModule } from "./presentation/createManufacturingModule";
export type { FrontModule, ManufacturingModuleDeps } from "./presentation/createManufacturingModule";
export { default as ManufacturingShell } from "./presentation/ManufacturingShell";
