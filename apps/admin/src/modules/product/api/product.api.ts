/**
 * Product Module API Layer
 * Connects to the Product microservice (port 9082)
 */
import { createEntityApi } from "@/core/crud";

// ─── Exports ──────────────────────────────────────────────────
export const categoryApi      = createEntityApi("product", "/category");
export const subCategoryApi   = createEntityApi("product", "/sub-category");
export const brandApi         = createEntityApi("product", "/brand");
export const productApi       = createEntityApi("product", "/product");
export const attributeApi     = createEntityApi("product", "/attribute");
export const productTagApi    = createEntityApi("product", "/product-tag");
export const productBundleApi = createEntityApi("product", "/product-bundle");
export const productPriceApi  = createEntityApi("product", "/product-price");
export const productReviewApi = createEntityApi("product", "/product-review");
