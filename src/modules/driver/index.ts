import { FrontModule } from "@/app/ModuleRegistry";
import { routes } from "./routes";
import { menu } from "./menu";

export const driverModule: FrontModule = {
  name: "driver",
  routes,
  menu,
  permissions: ["driver.read", "driver.create", "driver.update", "driver.delete"],
};
