import { UseFormReturn } from "react-hook-form";
import { User, Phone, Briefcase, AlertCircle, CalendarOff, Landmark, Fingerprint } from "lucide-react";
import type { FormTab } from "@kwim/core";
import type { EmployeeFormValues } from "./employee.schema";
import { GeneralTab } from "./tabs/GeneralTab";
import { ContactTab } from "./tabs/ContactTab";
import { JobTab } from "./tabs/JobTab";
import { LeaveDetailTab } from "./tabs/LeaveDetailTab";
import { BankDetailTab } from "./tabs/BankDetailTab";
import { IdentificationTab } from "./tabs/IdentificationTab";
import { EmergencyTab } from "./tabs/EmergencyTab";

interface UseEmployeeTabsOptions {
  form: UseFormReturn<EmployeeFormValues>;
  departments: { _id: string; name: string }[];
  positions: { _id: string; title: string }[];
  employees: { _id: string; firstName: string; lastName: string }[];
  currentEmployeeId?: string | null;
}

export function useEmployeeTabs({
  form,
  departments,
  positions,
  employees,
  currentEmployeeId,
}: UseEmployeeTabsOptions): FormTab[] {
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
      label: "Détail entreprise",
      icon: <Briefcase size={14} />,
      render: () => (
        <JobTab
          form={form}
          departments={departments}
          positions={positions}
          employees={employees.filter((e) => e._id !== currentEmployeeId)}
        />
      ),
    },
    {
      key: "leave",
      label: "Congés",
      icon: <CalendarOff size={14} />,
      render: (f) => <LeaveDetailTab form={f as UseFormReturn<EmployeeFormValues>} />,
    },
    {
      key: "bank",
      label: "Banque",
      icon: <Landmark size={14} />,
      render: (f) => <BankDetailTab form={f as UseFormReturn<EmployeeFormValues>} />,
    },
    {
      key: "identification",
      label: "Identification / Suivi",
      icon: <Fingerprint size={14} />,
      render: (f) => <IdentificationTab form={f as UseFormReturn<EmployeeFormValues>} />,
    },
    {
      key: "emergency",
      label: "Urgence",
      icon: <AlertCircle size={14} />,
      render: (f) => <EmergencyTab form={f as UseFormReturn<EmployeeFormValues>} />,
    },
  ];
}
