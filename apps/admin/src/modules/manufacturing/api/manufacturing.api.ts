import { createEntityApi } from "@/core/crud/createModule";

export const bomApi = createEntityApi("stock", "/bom");
export const moApi = createEntityApi("stock", "/manufacturing-order");
export const workCenterApi = createEntityApi("stock", "/work-center");
export const operationApi = createEntityApi("stock", "/operation");
export const qualityCheckApi = createEntityApi("stock", "/quality-check");
