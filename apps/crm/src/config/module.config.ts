import { ModuleConfig } from "@kwim/shared-ui";
import { UserCircle } from "lucide-react";

export const crmModuleConfig: ModuleConfig = {
  name: "crm",
  displayName: "Crm Management",
  icon: UserCircle,
  baseUrl: "/crm",
  
  quickActions: [
    {
      icon: UserCircle,
      label: "New Crm",
      description: "Create a new crm record",
      onClick: () => console.log("New crm"),
    },
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: UserCircle,
      path: "/",
    },
  ],

  routes: [],
  permissions: ["crm.view", "crm.manage"],
};
