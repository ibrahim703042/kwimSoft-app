/**
 * Unified Transport Module
 *
 * Groups all transport-related features under a single sidebar item
 * with an internal ModuleShell sidebar for sub-navigation:
 *   Drivers, Vehicles, Stations, Schedules, Trips, Seats, Tickets, Reservations
 */
import { FrontModule, AppRoute, MenuItem } from "@/app/ModuleRegistry";
import { Bus } from "lucide-react";
import PageTitle from "@/components/utilitie/PageTitle";
import TransportShell from "./TransportShell";

export const transportModule: FrontModule = {
  name: "transport",
  routes: [
    {
      path: "/transport",
      element: (
        <>
          <PageTitle title="Transport" />
          <TransportShell />
        </>
      ),
      permission: "driver.read",
    },
  ] as AppRoute[],
  menu: [
    {
      id: "transport",
      label: "Transport",
      path: "/transport",
      icon: Bus,
      permission: "driver.read",
    },
  ] as MenuItem[],
  permissions: [
    "driver.read", "driver.create", "driver.update", "driver.delete",
    "vehicle.read", "vehicle.create", "vehicle.update", "vehicle.delete",
    "station.read", "station.create", "station.update", "station.delete",
    "schedule.read", "schedule.create", "schedule.update", "schedule.delete",
    "trip.read", "trip.create", "trip.update", "trip.delete",
    "seat.read", "seat.create", "seat.update", "seat.delete",
    "ticket.read", "ticket.create", "ticket.update", "ticket.delete",
    "reservation.read", "reservation.create", "reservation.update", "reservation.delete",
  ],
};
