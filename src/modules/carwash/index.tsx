/**
 * Carwash Module
 *
 * Entities:
 * - Wash Services, Bays, Wash Orders
 */
import { FrontModule, AppRoute, MenuItem } from "@/app/ModuleRegistry";
import { Droplets } from "lucide-react";
import PageTitle from "@/components/utilitie/PageTitle";
import CarwashShell from "./CarwashShell";

export const carwashModule: FrontModule = {
  name: "carwash",
  routes: [
    {
      path: "/carwash",
      element: (
        <>
          <PageTitle title="Carwash" />
          <CarwashShell />
        </>
      ),
      permission: "wash_service.read",
    },
  ] as AppRoute[],
  menu: [
    {
      id: "carwash",
      label: "Carwash",
      path: "/carwash",
      icon: Droplets,
      permission: "wash_service.read",
    },
  ] as MenuItem[],
  permissions: [
    "wash_service.read", "wash_service.create", "wash_service.update", "wash_service.delete",
    "bay.read", "bay.create", "bay.update", "bay.delete",
    "wash_order.read", "wash_order.create", "wash_order.update", "wash_order.delete",
  ],
};
