/**
 * Maintenance Module API Layer
 * Connects to the Transport microservice (port 9084)
 */
import { createEntityApi } from "@kwim/core";

// ─── Exports ──────────────────────────────────────────────────
export const maintenanceRequestApi = createEntityApi("transport", "/maintenance-request");
export const inspectionApi         = createEntityApi("transport", "/inspection");
