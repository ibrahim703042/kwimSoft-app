import { z } from "zod";

const assignedLeaveSchema = z.object({
  leaveType: z.string(),
  days: z.number().min(0),
  isActive: z.boolean().default(true),
});

export const employeeSchema = z.object({
  // Personal
  employeeCode: z.string().optional(),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  phone: z.string().min(1, "Le téléphone est requis"),
  gender: z.string().min(1, "Le genre est requis"),
  birthDate: z.string().optional(),
  maritalStatus: z.string().optional(),
  nationalId: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  avatar: z.string().optional(),
  // Contact already covered above
  // Job / Company
  department: z.string().optional(),
  position: z.string().optional(),
  branch: z.string().optional(),
  supervisor: z.string().optional(),
  employmentType: z.string().optional(),
  officeTime: z.string().optional(),
  workspace: z.string().optional(),
  attendanceDuringHoliday: z.boolean().optional(),
  hireDate: z.string().min(1, "La date d'embauche est requise"),
  status: z.string().default("active"),
  // Leave
  leaveAllocated: z.number().min(0).optional(),
  assignedLeaves: z.array(assignedLeaveSchema).optional(),
  // Emergency
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  // Bank
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  accountHolderName: z.string().optional(),
  bankAccountType: z.string().optional(),
  // Card / tracking (QR, biometric, WiFi, IP)
  biometricId: z.string().optional(),
  wifiMac: z.string().optional(),
  deviceId: z.string().optional(),
  // Tab visibility switches
  showEntreprise: z.boolean().default(false),
  showConge: z.boolean().default(false),
  showBanque: z.boolean().default(false),
  showIdentification: z.boolean().default(false),
});

export type AssignedLeave = z.infer<typeof assignedLeaveSchema>;
export type EmployeeFormValues = z.infer<typeof employeeSchema>;

export const defaultValues: EmployeeFormValues = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  birthDate: "",
  maritalStatus: "",
  nationalId: "",
  address: "",
  description: "",
  avatar: "",
  department: "",
  position: "",
  branch: "",
  supervisor: "",
  employmentType: "",
  officeTime: "",
  workspace: "",
  attendanceDuringHoliday: false,
  hireDate: "",
  status: "active",
  leaveAllocated: 0,
  assignedLeaves: [],
  emergencyContact: "",
  emergencyPhone: "",
  bankName: "",
  bankAccountNumber: "",
  accountHolderName: "",
  bankAccountType: "",
  biometricId: "",
  wifiMac: "",
  deviceId: "",
  showEntreprise: false,
  showConge: false,
  showBanque: false,
  showIdentification: false,
};
