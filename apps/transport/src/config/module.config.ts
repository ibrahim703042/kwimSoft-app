import { ModuleConfig } from "@kwim/shared-ui";
import { Truck } from "lucide-react";

export const transportModuleConfig: ModuleConfig = {
  name: "transport",
  displayName: "Transport Management",
  icon: Truck,
  baseUrl: "/transport",
  
  quickActions: [
    {
      icon: Truck,
      label: "New Transport",
      description: "Create a new transport record",
      onClick: () => console.log("New transport"),
    },
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Truck,
      path: "/",
    },
  ],

  routes: [],
  permissions: ["transport.view", "transport.manage"],
};
