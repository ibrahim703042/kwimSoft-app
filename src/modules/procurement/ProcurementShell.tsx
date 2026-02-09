import {
  LayoutDashboard, Truck, ShoppingCart, FileQuestion, PackageCheck, ClipboardList,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";

import {
  ProcurementDashboard,
  SupplierPage,
  PurchaseOrderPage,
  PurchaseRequisitionPage,
  RfqPage,
  GoodsReceiptPage,
} from "./pages";

const items: ShellNavItem[] = [
  { key: "dashboard",             label: "Tableau de bord",    icon: LayoutDashboard,  component: ProcurementDashboard },
  { key: "suppliers",             label: "Fournisseurs",       icon: Truck,            component: SupplierPage },
  { key: "purchase-requisitions", label: "Demandes d'achat",   icon: ClipboardList,    component: PurchaseRequisitionPage },
  { key: "purchase-orders",       label: "Bons de commande",   icon: ShoppingCart,     component: PurchaseOrderPage },
  { key: "rfq",                   label: "Demandes de prix",   icon: FileQuestion,     component: RfqPage },
  { key: "goods-receipts",        label: "Réceptions",         icon: PackageCheck,     component: GoodsReceiptPage },
];

export default function ProcurementShell() {
  return (
    <ModuleShell
      title="Approvisionnement"
      breadcrumbPath="/procurement"
      items={items}
      enableSearch
    />
  );
}
