export { createAdminAreaModule } from "./presentation/createAdminAreaModule";
export type { FrontModule, AdminAreaModuleDeps } from "./presentation/createAdminAreaModule";
export { default as AdminAreaShell } from "./presentation/AdminAreaShell";
export { default as AdminAreaTabbedView } from "./presentation/AdminAreaTabbedView";
export {
  WelcomePage,
  ServerInfoPage,
  ProviderInfoPage,
  AuditLogPage,
  SystemStatusPage,
  GlobalSettingsPage,
} from "./presentation/pages";
export * from "./domain/platformData";
