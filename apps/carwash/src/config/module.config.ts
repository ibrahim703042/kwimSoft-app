import { ModuleConfig } from "@kwim/shared-ui";
import { Droplets } from "lucide-react";

export const carwashModuleConfig: ModuleConfig = {
  name: "carwash",
  displayName: "Lavage Auto",
  icon: Droplets,
  baseUrl: "/carwash",
  
  quickActions: [
    {
      icon: Droplets,
      label: "Nouvelle commande",
      description: "Créer une nouvelle commande de lavage",
      onClick: () => console.log("New wash order"),
    },
  ],

  menu: [
    { id: "dashboard", label: "Tableau de bord", icon: Droplets, path: "/" },
  ],

  routes: [],
  permissions: ["carwash.view", "carwash.manage"],
};
