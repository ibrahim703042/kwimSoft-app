/**
 * Fleet Maintenance Module
 *
 * Entities:
 * - Work Orders (Maintenance Requests), Inspections
 */
import { FrontModule, AppRoute, MenuItem } from "@/app/ModuleRegistry";
import { Wrench } from "lucide-react";
import PageTitle from "@/components/utilitie/PageTitle";
import MaintenanceShell from "./MaintenanceShell";

export const maintenanceModule: FrontModule = {
  name: "maintenance",
  routes: [
    {
      path: "/maintenance",
      element: (
        <>
          <PageTitle title="Maintenance" />
          <MaintenanceShell />
        </>
      ),
      permission: "maintenance.read",
    },
  ] as AppRoute[],
  menu: [
    {
      id: "maintenance",
      label: "Maintenance",
      path: "/maintenance",
      icon: Wrench,
      permission: "maintenance.read",
    },
  ] as MenuItem[],
  permissions: [
    "maintenance.read", "maintenance.create", "maintenance.update", "maintenance.delete",
    "inspection.read", "inspection.create", "inspection.update", "inspection.delete",
  ],
};
