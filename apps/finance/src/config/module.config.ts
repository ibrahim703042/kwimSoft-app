import { ModuleConfig } from "@kwim/shared-ui";
import { DollarSign } from "lucide-react";

export const financeModuleConfig: ModuleConfig = {
  name: "finance",
  displayName: "Finance Management",
  icon: DollarSign,
  baseUrl: "/finance",
  
  quickActions: [
    {
      icon: DollarSign,
      label: "New Finance",
      description: "Create a new finance record",
      onClick: () => console.log("New finance"),
    },
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: DollarSign,
      path: "/",
    },
  ],

  routes: [],
  permissions: ["finance.view", "finance.manage"],
};
