export { HR_PERMISSIONS } from "./domain/permissions";
export * from "./application/hr.api";
export { createHrModule } from "./presentation/createHrModule";
export type { FrontModule, HrModuleDeps } from "./presentation/createHrModule";

export { default as HrShell } from "./presentation/HrShell";
export type { HrShellProps } from "./presentation/HrShell";
export { default as HrAppRoutes } from "./presentation/HrAppRoutes";
