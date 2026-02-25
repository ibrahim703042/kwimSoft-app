import { ModuleConfig } from "@kwim/shared-ui";
import { Package } from "lucide-react";

export const productModuleConfig: ModuleConfig = {
  name: "product",
  displayName: "Product Management",
  icon: Package,
  baseUrl: "/product",
  
  quickActions: [
    {
      icon: Package,
      label: "New Product",
      description: "Create a new product record",
      onClick: () => console.log("New product"),
    },
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Package,
      path: "/",
    },
  ],

  routes: [],
  permissions: ["product.view", "product.manage"],
};
