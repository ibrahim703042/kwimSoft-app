import { FrontModule } from "@/app/ModuleRegistry";
import { routes } from "./routes";
import { menu } from "./menu";

export const dashboardModule: FrontModule = {
  name: "dashboard",
  routes,
  menu,
};
