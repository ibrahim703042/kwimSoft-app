import { MenuItem } from "@/app/ModuleRegistry";
import { PinMapFill } from "react-bootstrap-icons";

export const menu: MenuItem[] = [
  {
    id: "stations",
    label: "Stations",
    path: "/stations",
    icon: PinMapFill,
    permission: "station.read",
  },
];
