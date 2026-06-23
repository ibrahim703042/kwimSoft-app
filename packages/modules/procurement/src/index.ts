export { PROCUREMENT_PERMISSIONS } from "./domain/permissions";
export * from "./application/procurement.api";
export { createProcurementModule } from "./presentation/createProcurementModule";
export type { FrontModule, ProcurementModuleDeps } from "./presentation/createProcurementModule";
export { default as ProcurementShell } from "./presentation/ProcurementShell";
