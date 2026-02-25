import { ModuleConfig } from "@kwim/shared-ui";
import { Users } from "lucide-react";

export const hrModuleConfig: ModuleConfig = {
  name: "hr",
  displayName: "Hr Management",
  icon: Users,
  baseUrl: "/hr",
  
  quickActions: [
    {
      icon: Users,
      label: "New Hr",
      description: "Create a new hr record",
      onClick: () => console.log("New hr"),
    },
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Users,
      path: "/",
    },
  ],

  routes: [],
  permissions: ["hr.view", "hr.manage"],
};
