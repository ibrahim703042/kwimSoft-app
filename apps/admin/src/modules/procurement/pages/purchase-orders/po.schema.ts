import { z } from "zod";

// ─── Purchase Order Item (product line) ────────────────────────
const poItemSchema = z.object({
  product: z.string(),
  description: z.string().optional(),
  qtyAvailable: z.number().min(0).optional().or(z.literal("")),
  requestedQty: z.number().min(0).optional().or(z.literal("")),
  uom: z.string().default("Unit(s)"),
  unitPrice: z.number().min(0).optional().or(z.literal("")),
});

// ─── Purchase Order Schema ─────────────────────────────────────
export const poSchema = z.object({
  // Header fields
  orderNumber: z.string().optional(),
  supplier: z.string().optional(),
  orderDate: z.string().min(1, "La date est requise"),
  expectedDate: z.string().optional(),
  responsible: z.string().optional(),
  requisitionDept: z.string().optional(),
  chargingDept: z.string().optional(),
  currency: z.string().default("CDF"),
  purpose: z.string().optional(),
  status: z.string().default("draft"),

  // Product lines (Products tab)
  items: z.array(poItemSchema).optional(),

  // Budget tab
  budgetCode: z.string().optional(),
  budgetAmount: z.number().min(0).optional().or(z.literal("")),
  budgetNotes: z.string().optional(),

  // Purchase instructions
  purchaseInstructions: z.string().optional(),
  notes: z.string().optional(),

  // MTO (Make to Order) fields
  mtoEnabled: z.boolean().default(false),
  mtoRoute: z.string().optional(),
  autoCreatePO: z.boolean().default(false),
});

export type POFormValues = z.infer<typeof poSchema>;

export const poDefaultValues: POFormValues = {
  orderNumber: "",
  supplier: "",
  orderDate: new Date().toISOString().split("T")[0],
  expectedDate: "",
  responsible: "",
  requisitionDept: "",
  chargingDept: "",
  currency: "CDF",
  purpose: "",
  status: "draft",
  items: [],
  budgetCode: "",
  budgetAmount: "",
  budgetNotes: "",
  purchaseInstructions: "",
  notes: "",
  mtoEnabled: false,
  mtoRoute: "",
  autoCreatePO: false,
};
