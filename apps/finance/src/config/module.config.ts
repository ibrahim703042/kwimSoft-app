import { ModuleConfig } from "@kwim/shared-ui";
import { DollarSign } from "lucide-react";

export const financeModuleConfig: ModuleConfig = {
  name: "finance",
  displayName: "Finance & Comptabilité",
  icon: DollarSign,
  baseUrl: "/finance",
  
  quickActions: [
    {
      icon: DollarSign,
      label: "Nouvelle facture",
      description: "Créer une nouvelle facture",
      onClick: () => console.log("New invoice"),
    },
  ],

  menu: [
    { id: "dashboard", label: "Tableau de bord", icon: DollarSign, path: "/" },
  ],

  routes: [],
  permissions: ["finance.view", "finance.manage"],
};
