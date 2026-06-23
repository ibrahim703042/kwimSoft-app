/**
 * Procurement module — thin shim to @kwim/modules-procurement
 */
import { createProcurementModule } from "@kwim/modules-procurement";
import PageTitle from "@/components/utilitie/PageTitle";

export const procurementModule = createProcurementModule({ PageTitle });

export { PROCUREMENT_PERMISSIONS } from "@kwim/modules-procurement";
export * from "@kwim/modules-procurement";
