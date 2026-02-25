import { ModuleConfig } from "@kwim/shared-ui";
import { ShoppingBag } from "lucide-react";

export const procurementModuleConfig: ModuleConfig = {
  name: "procurement",
  displayName: "Procurement Management",
  icon: ShoppingBag,
  baseUrl: "/procurement",
  
  quickActions: [
    {
      icon: ShoppingBag,
      label: "New Procurement",
      description: "Create a new procurement record",
      onClick: () => console.log("New procurement"),
    },
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: ShoppingBag,
      path: "/",
    },
  ],

  routes: [],
  permissions: ["procurement.view", "procurement.manage"],
};
