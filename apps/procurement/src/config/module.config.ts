import { ModuleConfig } from "@kwim/shared-ui";
import { ShoppingCart } from "lucide-react";

export const procurementModuleConfig: ModuleConfig = {
  name: "procurement",
  displayName: "Approvisionnement",
  icon: ShoppingCart,
  baseUrl: "/procurement",
  
  quickActions: [
    {
      icon: ShoppingCart,
      label: "Nouvelle commande",
      description: "Créer un bon de commande",
      onClick: () => console.log("New purchase order"),
    },
  ],

  menu: [
    { id: "dashboard", label: "Tableau de bord", icon: ShoppingCart, path: "/" },
  ],

  routes: [],
  permissions: ["procurement.view", "procurement.manage"],
};
