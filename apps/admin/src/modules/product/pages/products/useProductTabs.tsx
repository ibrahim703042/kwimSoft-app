import { UseFormReturn } from "react-hook-form";
import { Box, SlidersHorizontal, ShoppingCart, Truck, Warehouse, FileText } from "lucide-react";
import type { FormTab } from "@/core/crud";
import type { ProductFormValues } from "./product.schema";
import { GeneralTab } from "./tabs/GeneralTab";
import { AttributesTab } from "./tabs/AttributesTab";
import { SalesTab } from "./tabs/SalesTab";
import { PurchaseTab } from "./tabs/PurchaseTab";
import { InventoryTab } from "./tabs/InventoryTab";
import { NotesTab } from "./tabs/NotesTab";

/**
 * Builds the conditional tab array for the product form.
 * Tabs appear/disappear based on canBeSold, canBePurchased, productType, etc.
 */
export function useProductTabs(form: UseFormReturn<ProductFormValues>): FormTab[] {
  const canBeSold = form.watch("canBeSold");
  const canBePurchased = form.watch("canBePurchased");
  const productType = form.watch("productType");
  const trackInventory = form.watch("trackInventory");
  const isGoods = productType === "goods" || productType === "combo";

  const tabs: FormTab[] = [];

  // 1. General (always)
  tabs.push({
    key: "general",
    label: "Informations générales",
    icon: <Box size={14} />,
    render: (f) => <GeneralTab form={f} />,
  });

  // 2. Attributes & Variants / Combo Choices (goods/combo only)
  if (isGoods) {
    const attrCount = form.watch("attributes")?.length || 0;
    const comboCount = form.watch("comboItems")?.length || 0;
    tabs.push({
      key: "attributes",
      label: productType === "combo" ? "Choix Combo" : "Attributs & Variantes",
      icon: <SlidersHorizontal size={14} />,
      badge: attrCount + comboCount,
      render: (f) => <AttributesTab form={f as UseFormReturn<ProductFormValues>} />,
    });
  }

  // 3. Sales (only if canBeSold)
  if (canBeSold) {
    tabs.push({
      key: "sales",
      label: "Ventes",
      icon: <ShoppingCart size={14} />,
      render: (f) => <SalesTab form={f} />,
    });
  }

  // 4. Purchase (only if canBePurchased)
  if (canBePurchased) {
    tabs.push({
      key: "purchase",
      label: "Achats",
      icon: <Truck size={14} />,
      badge: form.watch("suppliers")?.length || 0,
      render: (f) => <PurchaseTab form={f as UseFormReturn<ProductFormValues>} />,
    });
  }

  // 5. Inventory (goods + trackInventory checked)
  if (isGoods && trackInventory) {
    tabs.push({
      key: "inventory",
      label: "Inventaire",
      icon: <Warehouse size={14} />,
      render: (f) => <InventoryTab form={f} />,
    });
  }

  // 6. Notes (always)
  tabs.push({
    key: "notes",
    label: "Notes",
    icon: <FileText size={14} />,
    render: (f) => <NotesTab form={f} />,
  });

  return tabs;
}
