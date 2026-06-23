/**
 * Procurement Module API Layer
 * Connects to the Stock microservice (port 9083)
 */
import { createEntityApi } from "@kwim/core";

// ─── Exports ──────────────────────────────────────────────────
export const supplierApi      = createEntityApi("stock", "/supplier");
export const purchaseOrderApi = createEntityApi("stock", "/purchase-order");
export const rfqApi           = createEntityApi("stock", "/rfq");
export const goodsReceiptApi  = createEntityApi("stock", "/goods-receipt");
