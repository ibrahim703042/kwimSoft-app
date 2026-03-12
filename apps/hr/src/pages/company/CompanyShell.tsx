/**
 * CompanyShell - Shell component for Company management routes
 */
import { Routes, Route, Navigate } from "react-router-dom";
import CompanyPage from "./CompanyPage";
import BranchPage from "./BranchPage";

export default function CompanyShell() {
  return (
    <Routes>
      <Route index element={<CompanyPage />} />
      <Route path="branch" element={<BranchPage />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
}
