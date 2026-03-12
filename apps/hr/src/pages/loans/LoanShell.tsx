/**
 * LoanShell - Shell component for Loan management routes
 */
import { Routes, Route, Navigate } from "react-router-dom";
import LoanTypePage from "./LoanTypePage";
import LoanListPage from "./LoanListPage";
import LoanDetailPage from "./LoanDetailPage";
import LoanPaymentsPage from "./LoanPaymentsPage";

export default function LoanShell() {
  return (
    <Routes>
      <Route index element={<Navigate to="list" replace />} />
      <Route path="type" element={<LoanTypePage />} />
      <Route path="list" element={<LoanListPage />} />
      <Route path=":id" element={<LoanDetailPage />} />
      <Route path=":id/payments" element={<LoanPaymentsPage />} />
      <Route path="*" element={<Navigate to="list" replace />} />
    </Routes>
  );
}
