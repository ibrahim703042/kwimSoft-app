/**
 * Manufacturing Module
 *
 * Entities:
 * - Bill of Materials (BOM), Manufacturing Orders, Work Centers, Operations, Quality Checks
 * - Supports Odoo-style decomposed forms with header + tabs
 */
import { FrontModule, AppRoute, MenuItem } from "@/app/ModuleRegistry";
import { Factory } from "lucide-react";
import PageTitle from "@/components/utilitie/PageTitle";
import ManufacturingShell from "./ManufacturingShell";

export const manufacturingModule: FrontModule = {
  name: "manufacturing",
  routes: [
    {
      path: "/manufacturing",
      element: (
        <>
          <PageTitle title="Manufacturing" />
          <ManufacturingShell />
        </>
      ),
      permission: "manufacturing_order.read",
    },
  ] as AppRoute[],
  menu: [
    {
      id: "manufacturing",
      label: "Fabrication",
      path: "/manufacturing",
      icon: Factory,
      permission: "manufacturing_order.read",
    },
  ] as MenuItem[],
  permissions: [
    "bom.read", "bom.create", "bom.update", "bom.delete",
    "manufacturing_order.read", "manufacturing_order.create", "manufacturing_order.update", "manufacturing_order.delete",
    "work_center.read", "work_center.create", "work_center.update", "work_center.delete",
    "operation.read", "operation.create", "operation.update", "operation.delete",
    "quality_check.read", "quality_check.create", "quality_check.update", "quality_check.delete",
  ],
};
