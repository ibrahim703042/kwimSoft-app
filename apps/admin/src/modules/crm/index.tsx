/**
 * Crm module — thin shim to @kwim/modules-crm
 */
import { createCrmModule } from "@kwim/modules-crm";
import PageTitle from "@/components/utilitie/PageTitle";

export const crmModule = createCrmModule({ PageTitle });

export { CRM_PERMISSIONS } from "@kwim/modules-crm";
export * from "@kwim/modules-crm";
