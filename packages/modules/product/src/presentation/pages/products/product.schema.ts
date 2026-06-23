import { z } from "zod";

// ─── Schema ───────────────────────────────────────────────────
export const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  // Odoo booleans → control which tabs appear
  canBeSold: z.boolean().default(true),
  canBePurchased: z.boolean().default(true),
  trackInventory: z.boolean().default(true),
  // General tab fields
  productType: z.string().default("goods"),
  internalRef: z.string().optional(),
  barcode: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  brand: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  status: z.string().default("draft"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  // Sales tab
  price: z.number().min(0).optional().or(z.literal("")),
  currency: z.string().default("CDF"),
  salesTax: z.string().optional(),
  invoicingPolicy: z.string().optional(),
  // Purchase tab — supplier pricelist table
  suppliers: z.array(z.object({
    supplier: z.string(),
    supplierPrice: z.number().min(0).optional().or(z.literal("")),
    minQty: z.number().min(0).optional().or(z.literal("")),
    deliveryLeadTime: z.number().min(0).optional().or(z.literal("")),
    currency: z.string().default("CDF"),
  })).optional(),
  purchaseDescription: z.string().optional(),
  // Inventory tab
  stockQuantity: z.number().min(0).optional().or(z.literal("")),
  weight: z.number().min(0).optional().or(z.literal("")),
  volume: z.number().min(0).optional().or(z.literal("")),
  unit: z.string().default("pcs"),
  warehouse: z.string().optional(),
  reorderMin: z.number().min(0).optional().or(z.literal("")),
  reorderMax: z.number().min(0).optional().or(z.literal("")),
  trackingType: z.string().optional(),
  // Image (header)
  image: z.string().optional(),
  // Attributes — each row has attribute, value, and optional image
  attributes: z.array(z.object({
    attribute: z.string(),
    value: z.string(),
    image: z.string().optional(),
  })).optional(),
  // Combo choices — when productType is "combo" (like Odoo Combo Choices)
  comboItems: z.array(z.object({
    product: z.string(),
    productPrice: z.number().min(0).optional().or(z.literal("")),
    quantity: z.number().min(1).optional().or(z.literal("")),
  })).optional(),
  tags: z.array(z.string()).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const defaultValues: ProductFormValues = {
  name: "",
  canBeSold: true,
  canBePurchased: true,
  trackInventory: true,
  productType: "goods",
  internalRef: "",
  barcode: "",
  category: "",
  subCategory: "",
  brand: "",
  shortDescription: "",
  description: "",
  status: "draft",
  isActive: true,
  isFeatured: false,
  price: "",
  currency: "CDF",
  salesTax: "",
  invoicingPolicy: "ordered",
  suppliers: [],
  purchaseDescription: "",
  stockQuantity: "",
  weight: "",
  volume: "",
  unit: "pcs",
  warehouse: "",
  reorderMin: "",
  reorderMax: "",
  trackingType: "none",
  image: "",
  attributes: [],
  comboItems: [],
  tags: [],
};
