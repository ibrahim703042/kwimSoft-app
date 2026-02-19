/**
 * Finance Module API Layer
 * Connects to the Stock microservice (port 9083)
 */
import { createEntityApi } from "@/core/crud/createModule";

// ─── Exports ──────────────────────────────────────────────────
export const accountApi      = createEntityApi("stock", "/account");
export const invoiceApi      = createEntityApi("stock", "/invoice");
export const paymentApi      = createEntityApi("stock", "/payment");
export const budgetApi       = createEntityApi("stock", "/budget");
export const journalEntryApi = createEntityApi("stock", "/journal-entry");
export const taxConfigApi    = createEntityApi("stock", "/tax-config");
