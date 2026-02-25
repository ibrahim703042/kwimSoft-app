import { ModuleConfig } from "@kwim/shared-ui";
import { Truck } from "lucide-react";

export const transportModuleConfig: ModuleConfig = {
  name: "transport",
  displayName: "Transport",
  icon: Truck,
  baseUrl: "/transport",
  
  quickActions: [
    {
      icon: Truck,
      label: "Nouveau voyage",
      description: "Créer un nouveau voyage",
      onClick: () => console.log("New trip"),
    },
  ],

  menu: [
    { id: "dashboard", label: "Tableau de bord", icon: Truck, path: "/" },
  ],

  routes: [],
  permissions: ["transport.view", "transport.manage"],
};
