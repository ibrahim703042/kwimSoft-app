import { MenuItem } from "@/app/ModuleRegistry";
import { Speedometer } from "react-bootstrap-icons";

export const menu: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: Speedometer,
  },
];
