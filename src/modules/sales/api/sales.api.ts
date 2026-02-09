/**
 * Sales Module API Layer
 * Connects to the Stock microservice (port 9083)
 */
import { createEntityApi } from "@/core/crud/createModule";

// ─── Exports ──────────────────────────────────────────────────
export const customerApi    = createEntityApi("stock", "/customer");
export const orderApi       = createEntityApi("stock", "/order");
export const quotationApi   = createEntityApi("stock", "/quotation");
export const salesTeamApi   = createEntityApi("stock", "/sales-team");
export const pricingRuleApi = createEntityApi("stock", "/pricing-rule");
