import { ModuleConfig } from "@kwim/shared-ui";
import { Wrench } from "lucide-react";

export const maintenanceModuleConfig: ModuleConfig = {
  name: "maintenance",
  displayName: "Maintenance Management",
  icon: Wrench,
  baseUrl: "/maintenance",
  
  quickActions: [
    {
      icon: Wrench,
      label: "New Maintenance",
      description: "Create a new maintenance record",
      onClick: () => console.log("New maintenance"),
    },
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Wrench,
      path: "/",
    },
  ],

  routes: [],
  permissions: ["maintenance.view", "maintenance.manage"],
};
