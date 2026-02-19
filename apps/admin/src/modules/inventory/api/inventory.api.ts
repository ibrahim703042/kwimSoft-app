/**
 * Inventory Module API Layer
 * Connects to the Stock microservice (port 9083)
 */
import { createEntityApi } from "@/core/crud/createModule";

// ─── Exports ──────────────────────────────────────────────────
export const warehouseApi      = createEntityApi("stock", "/warehouse");
export const locationApi       = createEntityApi("stock", "/location");
export const stockApi          = createEntityApi("stock", "/stock");
export const stockMovementApi  = createEntityApi("stock", "/stock-movement");
export const transferApi       = createEntityApi("stock", "/transfer");
export const inventoryCountApi = createEntityApi("stock", "/inventory-count");
