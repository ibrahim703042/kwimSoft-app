import { z } from "zod";

export const attendanceSchema = z.object({
  employee: z.string().min(1, "L'employé est requis"),
  date: z.string().min(1, "La date est requise"),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  status: z.string().default("present"),
  notes: z.string().optional(),
  attendanceType: z.string().optional(),
  identifier: z.string().optional(),
});

export type AttendanceFormValues = z.infer<typeof attendanceSchema>;

export const defaultValues: AttendanceFormValues = {
  employee: "",
  date: "",
  checkInTime: "",
  checkOutTime: "",
  status: "present",
  notes: "",
  attendanceType: "manual",
  identifier: "",
};
