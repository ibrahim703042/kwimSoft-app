/**
 * ProjectShell - Shell component for Project management routes
 */
import { Routes, Route, Navigate } from "react-router-dom";
import ProjectPage from "./ProjectPage";
import TaskPage from "./TaskPage";
import ClientPage from "./ClientPage";

export default function ProjectShell() {
  return (
    <Routes>
      <Route index element={<ProjectPage />} />
      <Route path="tasks" element={<TaskPage />} />
      <Route path="clients" element={<ClientPage />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
}
