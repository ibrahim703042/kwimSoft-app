import { FrontModule } from "@/app/ModuleRegistry";
import { routes } from "./routes";
import { menu } from "./menu";

export const stationModule: FrontModule = {
  name: "station",
  routes,
  menu,
  permissions: ["station.read", "station.create", "station.update", "station.delete"],
};
