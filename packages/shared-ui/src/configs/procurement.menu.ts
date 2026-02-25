import {
  LayoutDashboard,
  Truck,
  ShoppingCart,
  FileQuestion,
  PackageCheck,
  ClipboardList,
} from "lucide-react";
import { BaseMenuItem } from "../types/module";

export const procurementMenuItems: BaseMenuItem[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "suppliers", label: "Fournisseurs", icon: Truck },
  { key: "purchase-requisitions", label: "Demandes d'achat", icon: ClipboardList },
  { key: "purchase-orders", label: "Bons de commande", icon: ShoppingCart },
  { key: "rfq", label: "Demandes de prix", icon: FileQuestion },
  { key: "goods-receipts", label: "Réceptions", icon: PackageCheck },
];

export const procurementModuleInfo = {
  name: "procurement",
  displayName: "Approvisionnement",
  title: "Approvisionnement",
  breadcrumbPath: "/procurement",
};
