export { CARWASH_PERMISSIONS } from "./domain/permissions";
export * from "./application/carwash.api";
export { createCarwashModule } from "./presentation/createCarwashModule";
export type { FrontModule, CarwashModuleDeps } from "./presentation/createCarwashModule";
export { default as CarwashShell } from "./presentation/CarwashShell";
