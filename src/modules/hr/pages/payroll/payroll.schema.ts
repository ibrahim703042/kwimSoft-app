import { z } from "zod";

export const payrollSchema = z.object({
  reference: z.string().min(1, "La référence est requise"),
  employee: z.string().min(1, "L'employé est requis"),
  period: z.string().min(1, "La période est requise"),
  grossSalary: z.string().min(1, "Le salaire brut est requis"),
  deductions: z.string().optional(),
  bonuses: z.string().optional(),
  netSalary: z.string().optional(),
  currency: z.string().min(1, "La devise est requise"),
  status: z.string().default("draft"),
  notes: z.string().optional(),
});

export type PayrollFormValues = z.infer<typeof payrollSchema>;

export const defaultValues: PayrollFormValues = {
  reference: "",
  employee: "",
  period: "",
  grossSalary: "",
  deductions: "0",
  bonuses: "0",
  netSalary: "",
  currency: "CDF",
  status: "draft",
  notes: "",
};
