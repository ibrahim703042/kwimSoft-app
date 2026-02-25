import { ModuleConfig } from "@kwim/shared-ui";
import { Factory } from "lucide-react";

export const manufacturingModuleConfig: ModuleConfig = {
  name: "manufacturing",
  displayName: "Manufacturing Management",
  icon: Factory,
  baseUrl: "/manufacturing",
  
  quickActions: [
    {
      icon: Factory,
      label: "New Manufacturing",
      description: "Create a new manufacturing record",
      onClick: () => console.log("New manufacturing"),
    },
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Factory,
      path: "/",
    },
  ],

  routes: [],
  permissions: ["manufacturing.view", "manufacturing.manage"],
};
