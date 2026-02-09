import { z } from "zod";

export const employeeSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  phone: z.string().min(1, "Le téléphone est requis"),
  department: z.string().optional(),
  position: z.string().optional(),
  hireDate: z.string().min(1, "La date d'embauche est requise"),
  status: z.string().default("active"),
  gender: z.string().min(1, "Le genre est requis"),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  nationalId: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

export const defaultValues: EmployeeFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  hireDate: "",
  status: "active",
  gender: "",
  birthDate: "",
  address: "",
  nationalId: "",
  emergencyContact: "",
  emergencyPhone: "",
};
