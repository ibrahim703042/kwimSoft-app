/**
 * Carwash Module API Layer
 * Connects to the Transport microservice (port 9084)
 */
import { createEntityApi } from "@/core/crud/createModule";

// ─── Exports ──────────────────────────────────────────────────
export const washServiceApi = createEntityApi("transport", "/wash-service");
export const bayApi         = createEntityApi("transport", "/bay");
export const washOrderApi   = createEntityApi("transport", "/wash-order");
