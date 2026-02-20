/**
 * AdminAreaShell — Console sidebar (real-world admin sections)
 *
 * - Overview: Welcome, Server info, Provider info (tabbed)
 * - Audit log: Recent activity
 * - System status: API/service health
 * - Global settings: App config & feature flags (read-only)
 */
import {
  LayoutGrid,
  ClipboardList,
  Activity,
  Settings2,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";
import AdminAreaTabbedView from "./AdminAreaTabbedView";
import AuditLogPage from "./pages/AuditLogPage";
import SystemStatusPage from "./pages/SystemStatusPage";
import GlobalSettingsPage from "./pages/GlobalSettingsPage";

const items: ShellNavItem[] = [
  {
    key: "admin-tabs",
    label: "Overview",
    icon: LayoutGrid,
    component: AdminAreaTabbedView,
  },
  {
    key: "audit-log",
    label: "Audit log",
    icon: ClipboardList,
    component: AuditLogPage,
  },
  {
    key: "system-status",
    label: "System status",
    icon: Activity,
    component: SystemStatusPage,
  },
  {
    key: "global-settings",
    label: "Global settings",
    icon: Settings2,
    component: GlobalSettingsPage,
  },
];

export default function AdminAreaShell() {
  return (
    <ModuleShell
      title="Application"
      breadcrumbPath="/console"
      items={items}
      defaultSelected="admin-tabs"
      enableSearch
    />
  );
}
