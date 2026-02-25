import { ModuleConfig } from "@kwim/shared-ui";
import { Box } from "lucide-react";

export const productModuleConfig: ModuleConfig = {
  name: "product",
  displayName: "Produits",
  icon: Box,
  baseUrl: "/products",
  
  quickActions: [
    {
      icon: Box,
      label: "Nouveau produit",
      description: "Créer un nouveau produit",
      onClick: () => console.log("New product"),
    },
  ],

  menu: [
    { id: "dashboard", label: "Tableau de bord", icon: Box, path: "/" },
  ],

  routes: [],
  permissions: ["product.view", "product.manage"],
};
