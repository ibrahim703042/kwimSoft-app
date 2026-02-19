import { FrontModule } from "@/app/ModuleRegistry";
import { routes } from "./routes";
import { menu } from "./menu";

export const reservationModule: FrontModule = {
  name: "reservation",
  routes,
  menu,
  permissions: ["reservation.read", "reservation.create", "reservation.update", "reservation.delete", "reservation.validate", "reservation.cancel"],
};
