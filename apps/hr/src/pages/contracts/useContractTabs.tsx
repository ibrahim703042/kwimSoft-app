import { UseFormReturn } from "react-hook-form";
import { FileText, CalendarRange } from "lucide-react";
import type { FormTab } from "@kwim/core";
import type { ContractFormValues } from "./contract.schema";
import { ContractTab } from "./tabs/ContractTab";
import { TermsTab } from "./tabs/TermsTab";

interface UseContractTabsOptions {
  form: UseFormReturn<ContractFormValues>;
  employees: { _id: string; firstName: string; lastName: string }[];
}

export function useContractTabs({ form, employees }: UseContractTabsOptions): FormTab[] {
  return [
    {
      key: "contract",
      label: "Contrat",
      icon: <FileText size={14} />,
      render: () => <ContractTab form={form} employees={employees} />,
    },
    {
      key: "terms",
      label: "Période & rémunération",
      icon: <CalendarRange size={14} />,
      render: (f) => <TermsTab form={f as UseFormReturn<ContractFormValues>} />,
    },
  ];
}
