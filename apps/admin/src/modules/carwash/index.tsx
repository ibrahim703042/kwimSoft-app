/**
 * Carwash module — thin shim to @kwim/modules-carwash
 */
import { createCarwashModule } from "@kwim/modules-carwash";
import PageTitle from "@/components/utilitie/PageTitle";

export const carwashModule = createCarwashModule({ PageTitle });

export { CARWASH_PERMISSIONS } from "@kwim/modules-carwash";
export * from "@kwim/modules-carwash";
