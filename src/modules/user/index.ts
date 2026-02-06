import { FrontModule } from "@/app/ModuleRegistry";
import { routes } from "./routes";
import { menu } from "./menu";

export const userModule: FrontModule = {
  name: "user",
  routes,
  menu,
  permissions: ["user.read", "user.create", "user.update", "user.delete"],
};
