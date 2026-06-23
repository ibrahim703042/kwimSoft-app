export const TRANSPORT_PERMISSIONS = [
  "driver.read", "driver.create", "driver.update", "driver.delete",
  "vehicle.read", "vehicle.create", "vehicle.update", "vehicle.delete",
  "station.read", "station.create", "station.update", "station.delete",
  "schedule.read", "schedule.create", "schedule.update", "schedule.delete",
  "trip.read", "trip.create", "trip.update", "trip.delete",
  "seat.read", "seat.create", "seat.update", "seat.delete",
  "ticket.read", "ticket.create", "ticket.update", "ticket.delete",
  "reservation.read", "reservation.create", "reservation.update", "reservation.delete",
] as const;
