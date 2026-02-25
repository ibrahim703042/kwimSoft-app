import {
  LayoutDashboard,
  UserCheck,
  ShoppingBag,
  FileText,
  Users,
  Percent,
} from "lucide-react";
import { BaseMenuItem } from "../types/module";

export const salesMenuItems: BaseMenuItem[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "customers", label: "Clients", icon: UserCheck },
  { key: "orders", label: "Commandes", icon: ShoppingBag },
  { key: "quotations", label: "Devis", icon: FileText },
  { key: "sales-teams", label: "Équipes de vente", icon: Users },
  { key: "pricing-rules", label: "Règles de prix", icon: Percent },
];

export const salesModuleInfo = {
  name: "sales",
  displayName: "Ventes",
  title: "Ventes",
  breadcrumbPath: "/sales",
};
