import { UseFormReturn } from "react-hook-form";
import { User, Phone, Briefcase, AlertCircle } from "lucide-react";
import { FormTab } from "@/core/crud/TabbedForm";
import type { EmployeeFormValues } from "./employee.schema";
import { GeneralTab } from "./tabs/GeneralTab";
import { ContactTab } from "./tabs/ContactTab";
import { JobTab } from "./tabs/JobTab";
import { EmergencyTab } from "./tabs/EmergencyTab";

interface UseEmployeeTabsOptions {
  form: UseFormReturn<EmployeeFormValues>;
  departments: { _id: string; name: string }[];
  positions: { _id: string; title: string }[];
}

export function useEmployeeTabs({ form, departments, positions }: UseEmployeeTabsOptions): FormTab[] {
  return [
    {
      key: "general",
      label: "Informations générales",
      icon: <User size={14} />,
      render: (f) => <GeneralTab form={f as UseFormReturn<EmployeeFormValues>} />,
    },
    {
      key: "contact",
      label: "Contact",
      icon: <Phone size={14} />,
      render: (f) => <ContactTab form={f as UseFormReturn<EmployeeFormValues>} />,
    },
    {
      key: "job",
      label: "Emploi",
      icon: <Briefcase size={14} />,
      render: () => <JobTab form={form} departments={departments} positions={positions} />,
    },
    {
      key: "emergency",
      label: "Urgence",
      icon: <AlertCircle size={14} />,
      render: (f) => <EmergencyTab form={f as UseFormReturn<EmployeeFormValues>} />,
    },
  ];
}
