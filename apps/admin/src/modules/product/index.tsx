/**
 * Product module — thin shim to @kwim/modules-product
 */
import { createProductModule } from "@kwim/modules-product";
import PageTitle from "@/components/utilitie/PageTitle";

export const productModule = createProductModule({ PageTitle });

export { PRODUCT_PERMISSIONS } from "@kwim/modules-product";
export * from "@kwim/modules-product";
