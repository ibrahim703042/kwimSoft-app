import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { REPORT_PERMISSIONS } from "../domain/permissions";
import ReportShell from "./ReportShell";

export interface ReportModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
}

export function createReportModule({ PageTitle }: ReportModuleDeps) {
  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "Reports" }),
    createElement(ReportShell)
  );

  return {
    name: "report",
    routes: [{ path: "/reports", element: routeElement, permission: "report.read" }] as AppRoute[],
    menu: [
      { id: "report", label: "Reports", path: "/reports", icon: BarChart3, permission: "report.read" },
    ] as MenuItem[],
    permissions: [...REPORT_PERMISSIONS],
  };
}
