/**
 * Finance module — thin shim to @kwim/modules-finance
 */
import { createFinanceModule } from "@kwim/modules-finance";
import PageTitle from "@/components/utilitie/PageTitle";

export const financeModule = createFinanceModule({ PageTitle });

export { FINANCE_PERMISSIONS } from "@kwim/modules-finance";
export * from "@kwim/modules-finance";
