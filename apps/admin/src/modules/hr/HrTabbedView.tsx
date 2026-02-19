/**
 * HrTabbedView — Digital HR-style tabbed content
 *
 * Shows HR entities (Employees, Departments, Payroll, etc.) as horizontal tabs
 * in the content area instead of a long sidebar list.
 */
import { useState } from "react";
import { ComponentType } from "react";
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
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EmployeePage,
  DepartmentPage,
  PositionPage,
  ContractPage,
  LeavePage,
  AttendancePage,
  PayrollPage,
  RecruitmentPage,
  TrainingPage,
  ExpensePage,
} from "./pages";

// ─── Tab config: key, label, icon, component ───────────────────
const HR_TABS: {
  key: string;
  label: string;
  icon: LucideIcon;
  component: ComponentType;
}[] = [
  { key: "employees", label: "Employés", icon: Users, component: EmployeePage },
  { key: "departments", label: "Départements", icon: Building2, component: DepartmentPage },
  { key: "positions", label: "Postes", icon: Briefcase, component: PositionPage },
  { key: "contracts", label: "Contrats", icon: FileText, component: ContractPage },
  { key: "leave", label: "Congés", icon: CalendarOff, component: LeavePage },
  { key: "attendance", label: "Présences", icon: Clock, component: AttendancePage },
  { key: "payroll", label: "Paie", icon: Wallet, component: PayrollPage },
  { key: "recruitment", label: "Recrutement", icon: UserPlus, component: RecruitmentPage },
  { key: "training", label: "Formations", icon: GraduationCap, component: TrainingPage },
  { key: "expenses", label: "Notes de frais", icon: Receipt, component: ExpensePage },
];

export default function HrTabbedView() {
  const [activeKey, setActiveKey] = useState(HR_TABS[0].key);
  const activeTab = HR_TABS.find((t) => t.key === activeKey);
  const ActiveComponent = activeTab?.component ?? (() => null);

  return (
    <div className="flex flex-col h-full">
      {/* Horizontal tabs — Digital HR style */}
      <div className="border-b bg-muted/30 shrink-0">
        <nav
          className="flex gap-0 overflow-x-auto scrollbar-thin"
          aria-label="Sections RH"
        >
          {HR_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeKey === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveKey(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  isActive
                    ? "border-[#0F123F] text-[#0F123F] bg-background"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-auto pt-2">
        <ActiveComponent />
      </div>
    </div>
  );
}
