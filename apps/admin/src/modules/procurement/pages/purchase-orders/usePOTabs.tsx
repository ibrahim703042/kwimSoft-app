import { UseFormReturn } from "react-hook-form";
import { Package, Wallet, FileText } from "lucide-react";
import type { FormTab } from "@/core/crud";
import type { POFormValues } from "./po.schema";
import { ProductsTab } from "./tabs/ProductsTab";
import { BudgetTab } from "./tabs/BudgetTab";

/**
 * Builds the tab array for the Purchase Order form.
 * Mirrors Odoo Purchase Requisition layout: Products + Budget tabs.
 */
export function usePOTabs(form: UseFormReturn<POFormValues>): FormTab[] {
  const tabs: FormTab[] = [];

  // 1. Products (always)
  tabs.push({
    key: "products",
    label: "Produits",
    icon: <Package size={14} />,
    badge: form.watch("items")?.length || 0,
    render: (f) => <ProductsTab form={f as UseFormReturn<POFormValues>} />,
  });

  // 2. Budget
  tabs.push({
    key: "budget",
    label: "Budget",
    icon: <Wallet size={14} />,
    render: (f) => <BudgetTab form={f as UseFormReturn<POFormValues>} />,
  });

  return tabs;
}
