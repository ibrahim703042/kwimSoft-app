/**
 * Sales Module
 *
 * Entities:
 * - Customers, Sales Orders, Quotations, Sales Teams, Pricing Rules
 */
import { FrontModule, AppRoute, MenuItem } from "@/app/ModuleRegistry";
import { TrendingUp } from "lucide-react";
import PageTitle from "@/components/utilitie/PageTitle";
import SalesShell from "./SalesShell";

export const salesModule: FrontModule = {
  name: "sales",
  routes: [
    {
      path: "/sales",
      element: (
        <>
          <PageTitle title="Sales" />
          <SalesShell />
        </>
      ),
      permission: "customer.read",
    },
  ] as AppRoute[],
  menu: [
    {
      id: "sales",
      label: "Sales",
      path: "/sales",
      icon: TrendingUp,
      permission: "customer.read",
    },
  ] as MenuItem[],
  permissions: [
    "customer.read", "customer.create", "customer.update", "customer.delete",
    "order.read", "order.create", "order.update", "order.delete",
    "quotation.read", "quotation.create", "quotation.update", "quotation.delete",
    "sales_team.read", "sales_team.create", "sales_team.update", "sales_team.delete",
    "pricing_rule.read", "pricing_rule.create", "pricing_rule.update", "pricing_rule.delete",
  ],
};
