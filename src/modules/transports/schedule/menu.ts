import { MenuItem } from "@/app/ModuleRegistry";
import { CalendarEvent } from "react-bootstrap-icons";

export const menu: MenuItem[] = [
  {
    id: "schedules",
    label: "Schedules",
    path: "/schedules",
    icon: CalendarEvent,
    permission: "schedule.read",
  },
];
