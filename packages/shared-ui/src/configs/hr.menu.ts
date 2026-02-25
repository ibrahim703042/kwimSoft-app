import {
  Users,
  Building2,
  Briefcase,
  FileText,
  CalendarOff,
  Clock,
  Wallet,
  UserPlus,
  GraduationCap,
  Receipt,
  LayoutGrid,
  LayoutDashboard,
  CreditCard,
  ListChecks,
} from "lucide-react";
import { BaseMenuItem } from "../types/module";

export const hrMenuItems: BaseMenuItem[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "employees", label: "Employés", icon: Users },
  { key: "employee-card-template", label: "Modèle carte employé", icon: CreditCard },
  { key: "departments", label: "Départements", icon: Building2 },
  { key: "positions", label: "Postes", icon: Briefcase },
  { key: "contracts", label: "Contrats", icon: FileText },
  { key: "leave", label: "Congés", icon: CalendarOff },
  { key: "attendance", label: "Présences", icon: Clock },
  { key: "attendance-log", label: "Journal des présences", icon: ListChecks },
  { key: "payroll", label: "Paie", icon: Wallet },
  { key: "recruitment", label: "Recrutement", icon: UserPlus },
  { key: "training", label: "Formations", icon: GraduationCap },
  { key: "expenses", label: "Notes de frais", icon: Receipt },
  { key: "user-tabs", label: "Gestion Utilisateurs", icon: LayoutGrid },
];

export const hrModuleInfo = {
  name: "hr",
  displayName: "RH & Personnel",
  title: "RH & Personnel",
  breadcrumbPath: "/hr",
};
