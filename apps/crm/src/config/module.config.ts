import { ModuleConfig } from "@kwim/shared-ui";
import { Users } from "lucide-react";

export const crmModuleConfig: ModuleConfig = {
  name: "crm",
  displayName: "CRM",
  icon: Users,
  baseUrl: "/crm",
  
  quickActions: [
    {
      icon: Users,
      label: "Nouveau contact",
      description: "Ajouter un nouveau contact",
      onClick: () => console.log("New contact"),
    },
  ],

  menu: [
    { id: "dashboard", label: "Tableau de bord", icon: Users, path: "/" },
  ],

  routes: [],
  permissions: ["crm.view", "crm.manage"],
};
