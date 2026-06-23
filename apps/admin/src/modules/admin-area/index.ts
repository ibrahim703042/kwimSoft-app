import { createAdminAreaModule } from "@kwim/modules-admin-area";
import PageTitle from "@/components/utilitie/PageTitle";
import { getModules } from "@/app/registerModules";

export const adminAreaModule = createAdminAreaModule({ PageTitle, getModules });

export {
  AdminAreaShell,
  AdminAreaTabbedView,
  WelcomePage,
  ServerInfoPage,
  ProviderInfoPage,
  AuditLogPage,
  SystemStatusPage,
  GlobalSettingsPage,
} from "@kwim/modules-admin-area";
