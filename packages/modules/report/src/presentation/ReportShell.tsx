import { BarChart3 } from "lucide-react";
import { ModuleShell, ShellNavItem } from "@kwim/shared-ui";
import ReportsPage from "./pages/ReportsPage";

const items: ShellNavItem[] = [
  { key: "reports", label: "Reports", icon: BarChart3, component: ReportsPage },
];

type ReportShellProps = Readonly<{ breadcrumbPath?: string }>;

export default function ReportShell({ breadcrumbPath = "/reports" }: ReportShellProps) {
  return (
    <ModuleShell title="Reports" breadcrumbPath={breadcrumbPath} items={items} enableSearch />
  );
}
