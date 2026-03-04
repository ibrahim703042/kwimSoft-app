import { UseFormReturn } from "react-hook-form";
import { CalendarRange, FileText } from "lucide-react";
import type { FormTab } from "@/core/crud";
import type { LeaveFormValues } from "./leave.schema";
import { RequestTab } from "./tabs/RequestTab";
import { PeriodTab } from "./tabs/PeriodTab";

interface UseLeaveTabsOptions {
  form: UseFormReturn<LeaveFormValues>;
  employees: { _id: string; firstName: string; lastName: string }[];
}

export function useLeaveTabs({ form, employees }: UseLeaveTabsOptions): FormTab[] {
  return [
    {
      key: "request",
      label: "Demande",
      icon: <FileText size={14} />,
      render: () => <RequestTab form={form} employees={employees} />,
    },
    {
      key: "period",
      label: "Période",
      icon: <CalendarRange size={14} />,
      render: (f) => <PeriodTab form={f as UseFormReturn<LeaveFormValues>} />,
    },
  ];
}
