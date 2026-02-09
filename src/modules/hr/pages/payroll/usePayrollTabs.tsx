import { UseFormReturn } from "react-hook-form";
import { FileText, Wallet } from "lucide-react";
import { FormTab } from "@/core/crud/TabbedForm";
import type { PayrollFormValues } from "./payroll.schema";
import { GeneralTab } from "./tabs/GeneralTab";
import { SalaryTab } from "./tabs/SalaryTab";

interface UsePayrollTabsOptions {
  form: UseFormReturn<PayrollFormValues>;
  employees: { _id: string; firstName: string; lastName: string }[];
}

export function usePayrollTabs({ form, employees }: UsePayrollTabsOptions): FormTab[] {
  return [
    {
      key: "general",
      label: "Général",
      icon: <FileText size={14} />,
      render: () => <GeneralTab form={form} employees={employees} />,
    },
    {
      key: "salary",
      label: "Montants & notes",
      icon: <Wallet size={14} />,
      render: (f) => <SalaryTab form={f as UseFormReturn<PayrollFormValues>} />,
    },
  ];
}
