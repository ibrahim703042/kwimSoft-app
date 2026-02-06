import { MenuItem } from "@/app/ModuleRegistry";
import { PersonLinesFill } from "react-bootstrap-icons";

export const menu: MenuItem[] = [
  {
    id: "user-management",
    label: "User Management",
    path: "/user-management",
    icon: PersonLinesFill,
    permission: "user.read",
  },
];
