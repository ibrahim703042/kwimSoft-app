/**
 * Manufacturing module — thin shim to @kwim/modules-manufacturing
 */
import { createManufacturingModule } from "@kwim/modules-manufacturing";
import PageTitle from "@/components/utilitie/PageTitle";

export const manufacturingModule = createManufacturingModule({ PageTitle });

export { MANUFACTURING_PERMISSIONS } from "@kwim/modules-manufacturing";
export * from "@kwim/modules-manufacturing";
