import {
  UserCheck, ShoppingBag, FileText, Users, Percent,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";

import {
  CustomerPage,
  SalesOrderPage,
  QuotationPage,
  SalesTeamPage,
  PricingRulePage,
} from "./pages";

const items: ShellNavItem[] = [
  { key: "customers",     label: "Clients",           icon: UserCheck,   component: CustomerPage },
  { key: "orders",        label: "Commandes",         icon: ShoppingBag, component: SalesOrderPage },
  { key: "quotations",    label: "Devis",             icon: FileText,    component: QuotationPage },
  { key: "sales-teams",   label: "Équipes de vente",  icon: Users,       component: SalesTeamPage },
  { key: "pricing-rules", label: "Règles de prix",    icon: Percent,     component: PricingRulePage },
];

export default function SalesShell() {
  return (
    <ModuleShell
      title="Ventes"
      breadcrumbPath="/sales"
      items={items}
      enableSearch
    />
  );
}
