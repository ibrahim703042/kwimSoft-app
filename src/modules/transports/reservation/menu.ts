import { MenuItem } from "@/app/ModuleRegistry";
import { JournalCheck } from "react-bootstrap-icons";

export const menu: MenuItem[] = [
  {
    id: "reservations",
    label: "Reservations",
    path: "/reservations",
    icon: JournalCheck,
    permission: "reservation.read",
  },
];
