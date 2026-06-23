/**
 * Sales module — thin shim to @kwim/modules-sales
 */
import { createSalesModule } from "@kwim/modules-sales";
import PageTitle from "@/components/utilitie/PageTitle";

export const salesModule = createSalesModule({ PageTitle });

export { SALES_PERMISSIONS } from "@kwim/modules-sales";
export * from "@kwim/modules-sales";
