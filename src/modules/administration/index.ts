import { FrontModule } from "@/app/ModuleRegistry";
import { routes } from "./routes";
import { menu } from "./menu";

export const administrationModule: FrontModule = {
  name: "administration",
  routes,
  menu,
  permissions: ["admin.read", "admin.manage"],
};
