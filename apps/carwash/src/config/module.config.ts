import { ModuleConfig } from "@kwim/shared-ui";
import { Droplets } from "lucide-react";

export const carwashModuleConfig: ModuleConfig = {
  name: "carwash",
  displayName: "Carwash Management",
  icon: Droplets,
  baseUrl: "/carwash",
  
  quickActions: [
    {
      icon: Droplets,
      label: "New Carwash",
      description: "Create a new carwash record",
      onClick: () => console.log("New carwash"),
    },
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Droplets,
      path: "/",
    },
  ],

  routes: [],
  permissions: ["carwash.view", "carwash.manage"],
};
