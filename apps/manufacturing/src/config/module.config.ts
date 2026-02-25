import { ModuleConfig } from "@kwim/shared-ui";
import { Factory } from "lucide-react";

export const manufacturingModuleConfig: ModuleConfig = {
  name: "manufacturing",
  displayName: "Fabrication",
  icon: Factory,
  baseUrl: "/manufacturing",
  
  quickActions: [
    {
      icon: Factory,
      label: "Nouvel ordre",
      description: "Créer un ordre de fabrication",
      onClick: () => console.log("New manufacturing order"),
    },
  ],

  menu: [
    { id: "dashboard", label: "Tableau de bord", icon: Factory, path: "/" },
  ],

  routes: [],
  permissions: ["manufacturing.view", "manufacturing.manage"],
};
