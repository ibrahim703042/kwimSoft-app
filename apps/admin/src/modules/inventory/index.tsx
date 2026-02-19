/**
 * Inventory & Warehouse Management Module
 *
 * Entities:
 * - Warehouses, Locations, Stock Levels, Stock Movements,
 *   Transfers, Inventory Counts
 */
import { FrontModule, AppRoute, MenuItem } from "@/app/ModuleRegistry";
import { Warehouse } from "lucide-react";
import PageTitle from "@/components/utilitie/PageTitle";
import InventoryShell from "./InventoryShell";

export const inventoryModule: FrontModule = {
  name: "inventory",
  routes: [
    {
      path: "/inventory",
      element: (
        <>
          <PageTitle title="Inventory" />
          <InventoryShell />
        </>
      ),
      permission: "warehouse.read",
    },
  ] as AppRoute[],
  menu: [
    {
      id: "inventory",
      label: "Inventory",
      path: "/inventory",
      icon: Warehouse,
      permission: "warehouse.read",
    },
  ] as MenuItem[],
  permissions: [
    "warehouse.read", "warehouse.create", "warehouse.update", "warehouse.delete",
    "location.read", "location.create", "location.update", "location.delete",
    "stock.read", "stock.create", "stock.update", "stock.delete",
    "stock_movement.read", "stock_movement.create", "stock_movement.update", "stock_movement.delete",
    "transfer.read", "transfer.create", "transfer.update", "transfer.delete",
    "inventory_count.read", "inventory_count.create", "inventory_count.update", "inventory_count.delete",
  ],
};
