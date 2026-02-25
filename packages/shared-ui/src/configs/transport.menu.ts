import {
  UserCheck,
  Truck,
  MapPin,
  Calendar,
  Navigation,
  Armchair,
  Ticket,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";
import { BaseMenuItem } from "../types/module";

export const transportMenuItems: BaseMenuItem[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "drivers", label: "Conducteurs", icon: UserCheck },
  { key: "vehicles", label: "Véhicules", icon: Truck },
  { key: "stations", label: "Gares", icon: MapPin },
  { key: "schedules", label: "Horaires", icon: Calendar },
  { key: "trips", label: "Voyages", icon: Navigation },
  { key: "seats", label: "Sièges", icon: Armchair },
  { key: "tickets", label: "Billets", icon: Ticket },
  { key: "reservations", label: "Réservations", icon: BookOpen },
];

export const transportModuleInfo = {
  name: "transport",
  displayName: "Transport",
  title: "Transport",
  breadcrumbPath: "/transport",
};
