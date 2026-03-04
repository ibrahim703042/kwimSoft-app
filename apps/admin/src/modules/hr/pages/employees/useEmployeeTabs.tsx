import { UseFormReturn } from "react-hook-form";
import { User, Phone, Briefcase, CalendarOff, Landmark, Fingerprint } from "lucide-react";
import type { FormTab } from "@/core/crud";
import type { EmployeeFormValues } from "./employee.schema";
import { GeneralTab } from "./tabs/GeneralTab";
import { ContactTab } from "./tabs/ContactTab";
import { JobTab } from "./tabs/JobTab";
import { LeaveDetailTab } from "./tabs/LeaveDetailTab";
import { BankDetailTab } from "./tabs/BankDetailTab";
import { IdentificationTab } from "./tabs/IdentificationTab";

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
  const showEntreprise = form.watch("showEntreprise");
  const showConge = form.watch("showConge");
  const showBanque = form.watch("showBanque");
  const showIdentification = form.watch("showIdentification");

  const tabs: FormTab[] = [
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
  ];

  if (showEntreprise) {
    tabs.push({
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
    });
  }

  if (showConge) {
    tabs.push({
      key: "leave",
      label: "Congés",
      icon: <CalendarOff size={14} />,
      render: (f) => <LeaveDetailTab form={f as UseFormReturn<EmployeeFormValues>} />,
    });
  }

  if (showBanque) {
    tabs.push({
      key: "bank",
      label: "Banque",
      icon: <Landmark size={14} />,
      render: (f) => <BankDetailTab form={f as UseFormReturn<EmployeeFormValues>} />,
    });
  }

  if (showIdentification) {
    tabs.push({
      key: "identification",
      label: "Identification / Suivi",
      icon: <Fingerprint size={14} />,
      render: (f) => <IdentificationTab form={f as UseFormReturn<EmployeeFormValues>} />,
    });
  }

  return tabs;
}
