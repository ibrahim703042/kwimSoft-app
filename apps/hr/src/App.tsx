import { AppLayout, type AppLayoutConfig } from "@kwim/shared-ui";
import { hrModuleConfig } from "./config/module.config";
import { Routes, Route, useNavigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import EmployeeShell from "./pages/employees/EmployeeShell";
import OrganizationShell from "./pages/organization/OrganizationShell";
import AttendanceShell from "./pages/attendences/AttendanceShell";
import PayrollShell from "./pages/payroll/PayrollShell";
import RecruitmentPage from "./pages/recruitements/RecruitmentPage";
import TrainingPage from "./pages/training/TrainingPage";
import UserShell from "./pages/users/UserShell";
import LoanShell from "./pages/loans/LoanShell";
import NoticePage from "./pages/notice/NoticePage";
import CompanyShell from "./pages/company/CompanyShell";
import ProjectShell from "./pages/projects/ProjectShell";
import SettingsPage from "./pages/settings/SettingsPage";
import LeavePage from "./pages/leave/LeavePage";

function App() {
  const navigate = useNavigate();

  const config: AppLayoutConfig = {
    appName: "KwimSoft HR",
    menus: hrModuleConfig.menu,
    user: {
      fullName: "HR User",
      email: "hr@kwimsoft.com",
      role: "HR Manager",
    },
    // quickActions: [
    //   {
    //     icon: UserPlus,
    //     label: "Add Employee",
    //     description: "Create a new employee",
    //     shortcut: "⌘E",
    //     onClick: () => navigate("/employees/new"),
    //   },
    //   {
    //     icon: Calendar,
    //     label: "Request Leave",
    //     description: "Submit leave request",
    //     onClick: () => navigate("/leave/new"),
    //   },
    //   {
    //     icon: FileText,
    //     label: "New Contract",
    //     description: "Create employment contract",
    //     onClick: () => navigate("/contracts/new"),
    //   },
    //   {
    //     icon: Clock,
    //     label: "Log Attendance",
    //     description: "Record attendance",
    //     onClick: () => navigate("/attendance"),
    //   },
    //   {
    //     icon: Users,
    //     label: "New Department",
    //     description: "Create department",
    //     onClick: () => navigate("/organization/departments/new"),
    //   },
    // ],
    notifications: [
      {
        id: "1",
        title: "New employee added",
        message: "John Doe has been added to the system",
        type: "info",
        time: "2 min ago",
        read: false,
      },
      {
        id: "2",
        title: "Leave request approved",
        message: "Your leave request has been approved",
        type: "success",
        time: "15 min ago",
        read: false,
      },
    ],
    onLogout: () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees/*" element={<EmployeeShell />} />
        <Route path="/organization/*" element={<OrganizationShell />} />
        <Route path="/company/*" element={<CompanyShell />} />
        <Route path="/attendance/*" element={<AttendanceShell />} />
        <Route path="/payroll/*" element={<PayrollShell />} />
        <Route path="/recruitment/*" element={<RecruitmentPage />} />
        <Route path="/training/*" element={<TrainingPage />} />
        <Route path="/users/*" element={<UserShell />} />
        <Route path="/loans/*" element={<LoanShell />} />
        <Route path="/leave/*" element={<LeavePage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/projects/*" element={<ProjectShell />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
