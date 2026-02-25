import { MenuItem, ModuleConfig } from "@kwim/shared-ui";
import { Users } from "lucide-react";

export const hrModuleConfig: ModuleConfig = {
  name: "hr",
  displayName: "Hr Management",
  icon: Users,
  baseUrl: "/hr",
  
  quickActions: [
    {
      icon: Users,
      label: "New Hr",
      description: "Create a new hr record",
      onClick: () => console.log("New hr"),
    },
  ],
  
  const items: MenuItem[] = [
    { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, component: HrDashboard },
  
    // ▸ People & Organization
    { key: "employees", label: "Employés", icon: Users, component: EmployeePage },
    { key: "employee-card-template", label: "Modèle carte employé", icon: CreditCard, component: EmployeeCardTemplatePage },
  
    // ▸ Organization
    { key: "departments", label: "Départements", icon: Building2, component: DepartmentPage },
    { key: "positions", label: "Postes", icon: Briefcase, component: PositionPage },
  
    // ▸ HR Operations
    { key: "contracts", label: "Contrats", icon: FileText, component: ContractPage },
    { key: "leave", label: "Congés", icon: CalendarOff, component: LeavePage },
    { key: "attendance", label: "Présences", icon: Clock, component: AttendancePage },
    { key: "attendance-log", label: "Journal des présences", icon: ListChecks, component: AttendanceLogPage },
    { key: "payroll", label: "Paie", icon: Wallet, component: PayrollPage },
    { key: "recruitment", label: "Recrutement", icon: UserPlus, component: RecruitmentPage },
    { key: "training", label: "Formations", icon: GraduationCap, component: TrainingPage },
    { key: "expenses", label: "Notes de frais", icon: Receipt, component: ExpensePage },
  
    // ▸ Access & Security
    { key: "user-tabs", label: "Gestion Utilisateurs", icon: LayoutGrid, component: UserTabbedView },
  ];

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Users,
      path: "/",
    },
  ] as MenuItem[],

  routes: [],
  permissions: [
    // People
    "employee.read", "employee.create", "employee.update", "employee.delete",
    "driver.read", "driver.create", "driver.update", "driver.delete",
    // Access
    "user.read", "user.create", "user.update", "user.delete",
    "role.read", "role.create", "role.update", "role.delete",
    "group.read", "group.create", "group.update", "group.delete",
    // Organization
    "department.read", "department.create", "department.update", "department.delete",
    "position.read", "position.create", "position.update", "position.delete",
    // HR Operations
    "contract.read", "contract.create", "contract.update", "contract.delete",
    "leave.read", "leave.create", "leave.update", "leave.delete",
    "attendance.read", "attendance.create", "attendance.update", "attendance.delete",
    "payroll.read", "payroll.create", "payroll.update", "payroll.delete",
    "recruitment.read", "recruitment.create", "recruitment.update", "recruitment.delete",
    "training.read", "training.create", "training.update", "training.delete",
    "expense.read", "expense.create", "expense.update", "expense.delete",
  ],
};
