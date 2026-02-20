/**
 * Admin area module — same structure as user module
 * - AdminAreaShell: shell with single "Admin" item (TabbedView)
 * - AdminAreaTabbedView: tabs Welcome | Server info | Provider info
 * - pages: WelcomePage, ServerInfoPage, ProviderInfoPage
 */
import { FrontModule } from "@/app/ModuleRegistry";
import { routes } from "./routes";
import { menu } from "./menu";

export const adminAreaModule: FrontModule = {
  name: "admin-area",
  routes,
  menu,
};

export { default as AdminAreaShell } from "./AdminAreaShell";
export { default as AdminAreaTabbedView } from "./AdminAreaTabbedView";
export {
  WelcomePage,
  ServerInfoPage,
  ProviderInfoPage,
  AuditLogPage,
  SystemStatusPage,
  GlobalSettingsPage,
} from "./pages";
