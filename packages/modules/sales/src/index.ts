export { SALES_PERMISSIONS } from "./domain/permissions";
export * from "./application/sales.api";
export { createSalesModule } from "./presentation/createSalesModule";
export type { FrontModule, SalesModuleDeps } from "./presentation/createSalesModule";
export { default as SalesShell } from "./presentation/SalesShell";
