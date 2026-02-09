/**
 * CRM Module API Layer
 * Connects to the HR microservice (port 9081)
 */
import { createEntityApi } from "@/core/crud/createModule";

// ─── Exports ──────────────────────────────────────────────────
export const contactApi     = createEntityApi("hr", "/contact");
export const leadApi        = createEntityApi("hr", "/lead");
export const opportunityApi = createEntityApi("hr", "/opportunity");
export const campaignApi    = createEntityApi("hr", "/campaign");
export const activityApi    = createEntityApi("hr", "/activity");
