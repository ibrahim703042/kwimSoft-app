import { FrontModule } from "@/app/ModuleRegistry";
import { routes } from "./routes";
import { menu } from "./menu";

export const scheduleModule: FrontModule = {
  name: "schedule",
  routes,
  menu,
  permissions: ["schedule.read", "schedule.create", "schedule.update", "schedule.delete"],
};
