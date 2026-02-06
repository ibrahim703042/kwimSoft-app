import { MenuItem } from "@/app/ModuleRegistry";
import { Sliders2 } from "react-bootstrap-icons";

export const menu: MenuItem[] = [
  {
    id: "administration",
    label: "Administration",
    path: "/administration",
    icon: Sliders2,
    permission: "admin.read",
  },
];
