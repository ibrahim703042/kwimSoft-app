/**
 * AdminAreaShell — Same structure as UserShell
 *
 * Single entry "Admin" (or "Dashboard") shows AdminAreaTabbedView
 * with tabs: Welcome | Server info | Provider info
 */
import { LayoutGrid } from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";
import AdminAreaTabbedView from "./AdminAreaTabbedView";

const items: ShellNavItem[] = [
  {
    key: "admin-tabs",
    label: "Admin",
    icon: LayoutGrid,
    component: AdminAreaTabbedView,
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
