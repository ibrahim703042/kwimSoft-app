import { ModuleConfig } from "@kwim/shared-ui";
import { Wrench } from "lucide-react";

export const maintenanceModuleConfig: ModuleConfig = {
  name: "maintenance",
  displayName: "Maintenance",
  icon: Wrench,
  baseUrl: "/maintenance",
  
  quickActions: [
    {
      icon: Wrench,
      label: "Nouvel ordre",
      description: "Créer un ordre de travail",
      onClick: () => console.log("New work order"),
    },
  ],

  menu: [
    { id: "dashboard", label: "Tableau de bord", icon: Wrench, path: "/" },
  ],

  routes: [],
  permissions: ["maintenance.view", "maintenance.manage"],
};
