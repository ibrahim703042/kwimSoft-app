import { z } from "zod";

export const driverSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  company: z.object({
    id: z.string(),
    name: z.string(),
  }).optional(),
});

export type DriverFormData = z.infer<typeof driverSchema>;
