import { ModuleConfig } from "@kwim/shared-ui";
import { ShoppingCart } from "lucide-react";

export const salesModuleConfig: ModuleConfig = {
  name: "sales",
  displayName: "Sales Management",
  icon: ShoppingCart,
  baseUrl: "/sales",
  
  quickActions: [
    {
      icon: ShoppingCart,
      label: "New Sales",
      description: "Create a new sales record",
      onClick: () => console.log("New sales"),
    },
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: ShoppingCart,
      path: "/",
    },
  ],

  routes: [],
  permissions: ["sales.view", "sales.manage"],
};
