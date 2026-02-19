import { z } from "zod";

export const leaveSchema = z.object({
  employee: z.string().min(1, "L'employé est requis"),
  type: z.string().default("annual"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
  reason: z.string().optional(),
  status: z.string().default("pending"),
});

export type LeaveFormValues = z.infer<typeof leaveSchema>;

export const defaultValues: LeaveFormValues = {
  employee: "",
  type: "annual",
  startDate: "",
  endDate: "",
  reason: "",
  status: "pending",
};
