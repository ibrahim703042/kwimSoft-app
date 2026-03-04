import { UseFormReturn } from "react-hook-form";
import { UserCheck, Clock } from "lucide-react";
import type { FormTab } from "@kwim/core";
import type { AttendanceFormValues } from "./attendance.schema";
import { PresenceTab } from "./tabs/PresenceTab";
import { ScheduleTab } from "./tabs/ScheduleTab";

interface UseAttendanceTabsOptions {
  form: UseFormReturn<AttendanceFormValues>;
  employees: { _id: string; firstName: string; lastName: string }[];
}

export function useAttendanceTabs({ form, employees }: UseAttendanceTabsOptions): FormTab[] {
  return [
    {
      key: "presence",
      label: "Présence",
      icon: <UserCheck size={14} />,
      render: () => <PresenceTab form={form} employees={employees} />,
    },
    {
      key: "schedule",
      label: "Horaires",
      icon: <Clock size={14} />,
      render: (f) => <ScheduleTab form={f as UseFormReturn<AttendanceFormValues>} />,
    },
  ];
}
