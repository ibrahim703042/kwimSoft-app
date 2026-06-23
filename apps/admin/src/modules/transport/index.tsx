/**
 * Unified Transport Module
 * Domain package: @kwim/modules-transport
 */
import { createTransportModule } from "@kwim/modules-transport";
import PageTitle from "@/components/utilitie/PageTitle";

export const transportModule = createTransportModule({ PageTitle });

export {
  stationApi,
  driverApi,
  vehicleApi,
  tripApi,
  seatApi,
  ticketApi,
  scheduleApi,
  reservationApi,
  TRANSPORT_PERMISSIONS,
} from "@kwim/modules-transport";
