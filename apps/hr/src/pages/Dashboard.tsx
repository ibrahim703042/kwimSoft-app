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
} from "lucide-react";
import {
  employeeApi,
  departmentApi,
  positionApi,
  contractApi,
  leaveApi,
  attendanceApi,
  payrollApi,
  recruitmentApi,
  trainingApi,
  expenseApi,
} from "./api/hr.api";

type ResData = (res: any) => any[];

function extractList(res: any): any[] {
  const data = res?.data;
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

async function fetchHrDashboardData() {
  const [
    empRes,
    deptRes,
    posRes,
    contractRes,
    leaveRes,
    attRes,
    payrollRes,
    recruitRes,
    trainRes,
    expenseRes,
  ] = await Promise.allSettled([
    employeeApi.getAll(),
    departmentApi.getAll(),
    positionApi.getAll(),
    contractApi.getAll(),
    leaveApi.getAll(),
    attendanceApi.getAll(),
    payrollApi.getAll(),
    recruitmentApi.getAll(),
    trainingApi.getAll(),
    expenseApi.getAll(),
  ]);

  const employees = extractList(empRes.status === "fulfilled" ? empRes.value : null);
  const departments = extractList(deptRes.status === "fulfilled" ? deptRes.value : null);
  const positions = extractList(posRes.status === "fulfilled" ? posRes.value : null);
  const contracts = extractList(contractRes.status === "fulfilled" ? contractRes.value : null);
  const leaves = extractList(leaveRes.status === "fulfilled" ? leaveRes.value : null);
  const attendances = extractList(attRes.status === "fulfilled" ? attRes.value : null);
  const payrolls = extractList(payrollRes.status === "fulfilled" ? payrollRes.value : null);
  const recruitments = extractList(recruitRes.status === "fulfilled" ? recruitRes.value : null);
  const trainings = extractList(trainRes.status === "fulfilled" ? trainRes.value : null);
  const expenses = extractList(expenseRes.status === "fulfilled" ? expenseRes.value : null);

  const today = new Date().toISOString().slice(0, 10);
  const leavePending = leaves.filter((l: any) => l.status === "pending").length;
  const leaveApproved = leaves.filter((l: any) => l.status === "approved").length;
  const attendanceToday = attendances.filter(
    (a: any) => a.date && a.date.toString().slice(0, 10) === today
  ).length;
  const payrollDraft = payrolls.filter((p: any) => p.status === "draft").length;
  const payrollPaid = payrolls.filter((p: any) => p.status === "paid").length;
  const contractsActive = contracts.filter((c: any) => c.status === "active").length;

  return {
    employeesTotal: employees.length,
    departmentsTotal: departments.length,
    positionsTotal: positions.length,
    contractsTotal: contracts.length,
    contractsActive,
    leaveTotal: leaves.length,
    leavePending,
    leaveApproved,
    attendanceTotal: attendances.length,
    attendanceToday,
    payrollTotal: payrolls.length,
    payrollDraft,
    payrollPaid,
    recruitmentTotal: recruitments.length,
    trainingTotal: trainings.length,
    expenseTotal: expenses.length,
    // For pie charts
    leaveByStatus: [
      { name: "En attente", value: leavePending },
      { name: "Approuvé", value: leaveApproved },
      { name: "Rejeté", value: leaves.filter((l: any) => l.status === "rejected").length },
      { name: "Annulé", value: leaves.filter((l: any) => l.status === "cancelled").length },
    ].filter((s) => s.value > 0),
    payrollByStatus: [
      { name: "Brouillon", value: payrollDraft },
      { name: "Confirmé", value: payrolls.filter((p: any) => p.status === "confirmed").length },
      { name: "Payé", value: payrollPaid },
      { name: "Annulé", value: payrolls.filter((p: any) => p.status === "cancelled").length },
    ].filter((s) => s.value > 0),
  };
}

const dashboardConfig: DashboardConfig = {
  queryKey: ["hr-dashboard"],
  queryFn: fetchHrDashboardData,
  stats: [
    {
      key: "employees",
      label: "Employés",
      icon: Users,
      color: "#0F123F",
      getValue: (d) => d?.employeesTotal ?? 0,
    },
    {
      key: "departments",
      label: "Départements",
      icon: Building2,
      color: "#3b82f6",
      getValue: (d) => d?.departmentsTotal ?? 0,
    },
    {
      key: "positions",
      label: "Postes",
      icon: Briefcase,
      color: "#8b5cf6",
      getValue: (d) => d?.positionsTotal ?? 0,
    },
    {
      key: "leave-pending",
      label: "Congés en attente",
      icon: CalendarOff,
      color: "#f59e0b",
      getValue: (d) => d?.leavePending ?? 0,
    },
    {
      key: "attendance-today",
      label: "Présents aujourd'hui",
      icon: Clock,
      color: "#10b981",
      getValue: (d) => d?.attendanceToday ?? 0,
    },
    {
      key: "payroll-draft",
      label: "Paie (brouillon)",
      icon: Wallet,
      color: "#06b6d4",
      getValue: (d) => d?.payrollDraft ?? 0,
    },
    {
      key: "payroll-paid",
      label: "Paie (payée)",
      icon: Wallet,
      color: "#059669",
      getValue: (d) => d?.payrollPaid ?? 0,
    },
    {
      key: "contracts-active",
      label: "Contrats actifs",
      icon: FileText,
      color: "#0F123F",
      getValue: (d) => d?.contractsActive ?? 0,
    },
    {
      key: "recruitment",
      label: "Recrutements",
      icon: UserPlus,
      color: "#ec4899",
      getValue: (d) => d?.recruitmentTotal ?? 0,
    },
    {
      key: "training",
      label: "Formations",
      icon: GraduationCap,
      color: "#6366f1",
      getValue: (d) => d?.trainingTotal ?? 0,
    },
    {
      key: "expenses",
      label: "Notes de frais",
      icon: Receipt,
      color: "#f97316",
      getValue: (d) => d?.expenseTotal ?? 0,
    },
  ],
  charts: [
    {
      key: "leave-status",
      title: "Congés par statut",
      type: "pie",
      dataKeys: [{ key: "value", color: "#3b82f6" }],
      nameKey: "name",
      getData: (d) => (d?.leaveByStatus?.length ? d.leaveByStatus : [{ name: "Aucun", value: 1 }]),
    },
    {
      key: "payroll-status",
      title: "Paie par statut",
      type: "pie",
      dataKeys: [{ key: "value", color: "#10b981" }],
      nameKey: "name",
      getData: (d) =>
        d?.payrollByStatus?.length ? d.payrollByStatus : [{ name: "Aucun", value: 1 }],
    },
  ],
};

export default function HrDashboard() {
  return <ModuleDashboard config={dashboardConfig} />;
}
