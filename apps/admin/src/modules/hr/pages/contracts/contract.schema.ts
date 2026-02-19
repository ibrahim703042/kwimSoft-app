import { z } from "zod";

export const contractSchema = z.object({
  reference: z.string().min(1, "La référence est requise"),
  employee: z.string().min(1, "L'employé est requis"),
  type: z.string().default("cdi"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().optional(),
  salary: z.string().min(1, "Le salaire est requis"),
  currency: z.string().min(1, "La devise est requise"),
  status: z.string().default("draft"),
  notes: z.string().optional(),
});

export type ContractFormValues = z.infer<typeof contractSchema>;

export const defaultValues: ContractFormValues = {
  reference: "",
  employee: "",
  type: "cdi",
  startDate: "",
  endDate: "",
  salary: "",
  currency: "CDF",
  status: "draft",
  notes: "",
};
