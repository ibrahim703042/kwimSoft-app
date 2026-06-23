import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EmployeeShell from "./pages/employees/EmployeeShell";
import OrganizationShell from "./pages/organization/OrganizationShell";
import AttendanceShell from "./pages/attendences/AttendanceShell";
import PayrollShell from "./pages/payroll/PayrollShell";
import RecruitmentPage from "./pages/recruitements/RecruitmentPage";
import TrainingPage from "./pages/training/TrainingPage";
import { UserTabbedView } from "@kwim/modules-user";
import LoanShell from "./pages/loans/LoanShell";
import NoticePage from "./pages/notice/NoticePage";
import CompanyShell from "./pages/company/CompanyShell";
import ProjectShell from "./pages/projects/ProjectShell";
import SettingsPage from "./pages/settings/SettingsPage";
import LeavePage from "./pages/leave/LeavePage";

export default function HrAppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/employees/*" element={<EmployeeShell />} />
      <Route path="/organization/*" element={<OrganizationShell />} />
      <Route path="/company/*" element={<CompanyShell />} />
      <Route path="/attendance/*" element={<AttendanceShell />} />
      <Route path="/payroll/*" element={<PayrollShell />} />
      <Route path="/recruitment" element={<RecruitmentPage />} />
      <Route path="/training" element={<TrainingPage />} />
      <Route path="/users/*" element={<UserTabbedView />} />
      <Route path="/loans/*" element={<LoanShell />} />
      <Route path="/leave" element={<LeavePage />} />
      <Route path="/notice" element={<NoticePage />} />
      <Route path="/projects/*" element={<ProjectShell />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

