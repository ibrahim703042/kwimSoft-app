/**
 * Procurement Module
 *
 * Entities:
 * - Suppliers, Purchase Requisitions, Purchase Orders, RFQ, Goods Receipts
 * - Supports MTO (Make to Order) and auto-purchase from POS
 */
import { FrontModule, AppRoute, MenuItem } from "@/app/ModuleRegistry";
import { ShoppingCart } from "lucide-react";
import PageTitle from "@/components/utilitie/PageTitle";
import ProcurementShell from "./ProcurementShell";

export const procurementModule: FrontModule = {
  name: "procurement",
  routes: [
    {
      path: "/procurement",
      element: (
        <>
          <PageTitle title="Procurement" />
          <ProcurementShell />
        </>
      ),
      permission: "supplier.read",
    },
  ] as AppRoute[],
  menu: [
    {
      id: "procurement",
      label: "Procurement",
      path: "/procurement",
      icon: ShoppingCart,
      permission: "supplier.read",
    },
  ] as MenuItem[],
  permissions: [
    "supplier.read", "supplier.create", "supplier.update", "supplier.delete",
    "purchase_requisition.read", "purchase_requisition.create", "purchase_requisition.update", "purchase_requisition.delete",
    "purchase_order.read", "purchase_order.create", "purchase_order.update", "purchase_order.delete",
    "rfq.read", "rfq.create", "rfq.update", "rfq.delete",
    "goods_receipt.read", "goods_receipt.create", "goods_receipt.update", "goods_receipt.delete",
  ],
};
