import { MenuItem } from "@/app/ModuleRegistry";
import { PersonVcard } from "react-bootstrap-icons";

export const menu: MenuItem[] = [
  {
    id: "drivers",
    label: "Drivers",
    path: "/drivers",
    icon: PersonVcard,
    permission: "driver.read",
  },
];
