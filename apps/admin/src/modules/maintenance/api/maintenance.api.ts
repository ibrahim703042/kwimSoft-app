/**
 * Maintenance Module API Layer
 * Connects to the Transport microservice (port 9084)
 */
import { createEntityApi } from "@/core/crud/createModule";

// ─── Exports ──────────────────────────────────────────────────
export const maintenanceRequestApi = createEntityApi("transport", "/maintenance-request");
export const inspectionApi         = createEntityApi("transport", "/inspection");
