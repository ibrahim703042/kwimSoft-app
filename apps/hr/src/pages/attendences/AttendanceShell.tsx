/**
 * AttendanceShell - Attendance, Leave & Log Management Shell
 */
import { Clock, CalendarOff, ListChecks } from "lucide-react";
import { ModuleShell, ShellNavItem } from "@kwim/shared-ui";
import AttendancePage from "./AttendancePage";
import AttendanceLogPage from "./AttendanceLogPage";
import LeavePage from "../leave/LeavePage";

const items: ShellNavItem[] = [
  { key: "attendance", label: "Présences", icon: Clock, component: AttendancePage },
  { key: "attendance-log", label: "Journal des présences", icon: ListChecks, component: AttendanceLogPage },
  { key: "leave", label: "Congés", icon: CalendarOff, component: LeavePage },
];

export default function AttendanceShell() {
  return (
    <ModuleShell
      title="Présences & Congés"
      items={items}
      defaultSelected="attendance"
      enableSearch
    />
  );
}
