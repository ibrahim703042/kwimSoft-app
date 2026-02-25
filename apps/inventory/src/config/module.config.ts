import { ModuleConfig } from "@kwim/shared-ui";
import { Warehouse } from "lucide-react";

export const inventoryModuleConfig: ModuleConfig = {
  name: "inventory",
  displayName: "Inventory Management",
  icon: Warehouse,
  baseUrl: "/inventory",
  
  quickActions: [
    {
      icon: Warehouse,
      label: "New Inventory",
      description: "Create a new inventory record",
      onClick: () => console.log("New inventory"),
    },
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Warehouse,
      path: "/",
    },
  ],

  routes: [],
  permissions: ["inventory.view", "inventory.manage"],
};
