import { ModuleConfig } from "@kwim/shared-ui";
import { ShoppingBag } from "lucide-react";

export const salesModuleConfig: ModuleConfig = {
  name: "sales",
  displayName: "Ventes",
  icon: ShoppingBag,
  baseUrl: "/sales",
  
  quickActions: [
    {
      icon: ShoppingBag,
      label: "Nouvelle commande",
      description: "Créer une nouvelle commande",
      onClick: () => console.log("New sales order"),
    },
  ],

  menu: [
    { id: "dashboard", label: "Tableau de bord", icon: ShoppingBag, path: "/" },
  ],

  routes: [],
  permissions: ["sales.view", "sales.manage"],
};
