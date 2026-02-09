import { z } from "zod";

// ─── Manufacturing Order Component Line ────────────────────────
const moComponentSchema = z.object({
  product: z.string(),
  description: z.string().optional(),
  quantity: z.number().min(0).optional().or(z.literal("")),
  uom: z.string().default("Unit(s)"),
  consumed: z.number().min(0).optional().or(z.literal("")),
});

// ─── Work Order Line ───────────────────────────────────────────
const workOrderSchema = z.object({
  operation: z.string(),
  workCenter: z.string().optional(),
  durationExpected: z.number().min(0).optional().or(z.literal("")),
  durationActual: z.number().min(0).optional().or(z.literal("")),
  status: z.string().default("pending"),
});

// ─── Manufacturing Order Schema ────────────────────────────────
export const moSchema = z.object({
  // Header
  reference: z.string().optional(),
  product: z.string().optional(),
  bom: z.string().optional(),
  quantity: z.number().min(0).optional().or(z.literal("")),
  uom: z.string().default("Unit(s)"),
  responsible: z.string().optional(),
  scheduledDate: z.string().optional(),
  deadline: z.string().optional(),
  priority: z.string().default("normal"),
  status: z.string().default("draft"),

  // Components tab
  components: z.array(moComponentSchema).optional(),

  // Work Orders tab
  workOrders: z.array(workOrderSchema).optional(),

  // Notes
  sourceDocument: z.string().optional(),
  notes: z.string().optional(),
});

export type MOFormValues = z.infer<typeof moSchema>;

export const moDefaultValues: MOFormValues = {
  reference: "",
  product: "",
  bom: "",
  quantity: 1,
  uom: "Unit(s)",
  responsible: "",
  scheduledDate: new Date().toISOString().split("T")[0],
  deadline: "",
  priority: "normal",
  status: "draft",
  components: [],
  workOrders: [],
  sourceDocument: "",
  notes: "",
};
