/**
 * AttendanceShell - Attendance, Leave & Log Management Shell (route-based)
 */
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { Clock, CalendarOff, ListChecks } from "lucide-react";
import { ModuleShell, ShellNavItem } from "@kwim/shared-ui";
import AttendancePage from "./AttendancePage";
import AttendanceLogPage from "./AttendanceLogPage";
import LeavePage from "../leave/LeavePage";

const items: ShellNavItem[] = [
  { key: "attendance", label: "Présences", icon: Clock, path: "." },
  { key: "attendance-log", label: "Journal des présences", icon: ListChecks, path: "logs" },
  { key: "leave", label: "Congés", icon: CalendarOff, path: "leave" },
];

export default function AttendanceShell() {
  return (
    <ModuleShell
      title="Présences & Congés"
      items={items}
      LinkComponent={Link}
      enableSearch
    >
      <Routes>
        <Route index element={<AttendancePage />} />
        <Route path="logs" element={<AttendanceLogPage />} />
        <Route path="leave" element={<LeavePage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </ModuleShell>
  );
}
