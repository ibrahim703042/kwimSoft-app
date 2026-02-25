import { AppShell } from "@kwim/shared-ui";
import { hrModuleConfig } from "@/config/module.config";
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import EmployeeShell from "./pages/employees/EmployeeShell";
import OrganizationShell from "./pages/organization/OrganizationShell";
import AttendanceShell from "./pages/attendences/AttendanceShell";
import PayrollShell from "./pages/payroll/PayrollShell";
import RecruitmentPage from "./pages/recruitements/RecruitmentPage";
import TrainingPage from "./pages/training/TrainingPage";
import UserShell from "./pages/users/UserShell";

function App() {
  const location = useLocation();

  return (
    <AppShell
      menus={hrModuleConfig.menu}
      quickActions={hrModuleConfig.quickActions}
      currentPath={location.pathname}
      isAuthenticated={true}
      breadcrumbs={
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">HR</span>
          <span className="text-gray-400">/</span>
          <span className="font-medium">Dashboard</span>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees/*" element={<EmployeeShell />} />
        <Route path="/organization/*" element={<OrganizationShell />} />
        <Route path="/attendance/*" element={<AttendanceShell />} />
        <Route path="/payroll/*" element={<PayrollShell />} />
        <Route path="/recruitment" element={<RecruitmentPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/users/*" element={<UserShell />} />
      </Routes>
    </AppShell>
  );
}

export default App;
