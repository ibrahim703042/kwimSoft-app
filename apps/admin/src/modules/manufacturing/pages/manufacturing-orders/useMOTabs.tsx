import { UseFormReturn } from "react-hook-form";
import { Package, Wrench, FileText } from "lucide-react";
import type { FormTab } from "@/core/crud";
import type { MOFormValues } from "./mo.schema";
import { ComponentsTab } from "./tabs/ComponentsTab";
import { WorkOrdersTab } from "./tabs/WorkOrdersTab";
import { NotesTab } from "./tabs/NotesTab";

/**
 * Builds the tab array for the Manufacturing Order form.
 */
export function useMOTabs(form: UseFormReturn<MOFormValues>): FormTab[] {
  return [
    {
      key: "components",
      label: "Composants",
      icon: <Package size={14} />,
      badge: form.watch("components")?.length || 0,
      render: (f) => <ComponentsTab form={f as UseFormReturn<MOFormValues>} />,
    },
    {
      key: "work-orders",
      label: "Ordres de travail",
      icon: <Wrench size={14} />,
      badge: form.watch("workOrders")?.length || 0,
      render: (f) => <WorkOrdersTab form={f as UseFormReturn<MOFormValues>} />,
    },
    {
      key: "notes",
      label: "Notes",
      icon: <FileText size={14} />,
      render: (f) => <NotesTab form={f as UseFormReturn<MOFormValues>} />,
    },
  ];
}
