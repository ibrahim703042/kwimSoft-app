#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const adminHr = path.join(ROOT, "apps/admin/src/modules/hr");
const satHr = path.join(ROOT, "apps/hr/src");
const pkgPres = path.join(ROOT, "packages/modules/hr/src/presentation");

function fixImports(content) {
  return content
    .replaceAll("@/core/crud", "@kwim/core")
    .replaceAll("@/core/ui", "@kwim/shared-ui")
    .replaceAll("@/components/ui", "@kwim/shared-ui")
    .replaceAll(`from "@kwim/modules-hr"`, `from "../../../application/hr.api"`)
    .replaceAll(`from "@/modules/hr`, `from "`)
    .replaceAll(`from "../user"`, `from "__USER_MANAGEMENT__"`);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else if (/\.(tsx?)$/.test(entry.name)) {
      fs.writeFileSync(d, fixImports(fs.readFileSync(s, "utf8")));
    }
  }
}

// Copy admin HR presentation
copyDir(path.join(adminHr, "pages"), path.join(pkgPres, "pages"));
for (const f of ["HrShell.tsx", "HrDashboard.tsx", "HrTabbedView.tsx"]) {
  const src = path.join(adminHr, f);
  if (fs.existsSync(src)) {
    fs.writeFileSync(path.join(pkgPres, f), fixImports(fs.readFileSync(src, "utf8")));
  }
}

// Merge satellite-only pages
const satPages = path.join(satHr, "pages");
const satOnly = ["company", "loans", "notice", "organization", "projects", "settings", "users"];
for (const dir of satOnly) {
  copyDir(path.join(satPages, dir), path.join(pkgPres, "pages", dir));
}
// Satellite shells that differ
for (const dir of ["employees", "attendences", "payroll"]) {
  const satShell = path.join(satPages, dir);
  if (fs.existsSync(satShell)) {
    copyDir(satShell, path.join(pkgPres, "pages", dir));
  }
}

// Fix HrShell - UserManagement injection + breadcrumbPath
const hrShellPath = path.join(pkgPres, "HrShell.tsx");
let hrShell = fs.readFileSync(hrShellPath, "utf8");
hrShell = hrShell.replace(
  `import { UserTabbedView } from "__USER_MANAGEMENT__";`,
  `import type { ComponentType } from "react";`
);
hrShell = hrShell.replace(
  `{ key: "user-tabs", label: "Gestion Utilisateurs", icon: LayoutGrid, component: UserTabbedView },`,
  `...(UserManagement ? [{ key: "user-tabs", label: "Gestion Utilisateurs", icon: LayoutGrid, component: UserManagement }] : []),`
);
hrShell = hrShell.replace(
  `export default function HrShell() {`,
  `export interface HrShellProps {
  breadcrumbPath?: string;
  UserManagement?: ComponentType;
}

export default function HrShell({ breadcrumbPath = "/hr", UserManagement }: HrShellProps) {`
);
hrShell = hrShell.replace(`breadcrumbPath="/hr"`, `breadcrumbPath={breadcrumbPath}`);
// Fix items array - need to make items a function or use spread properly
hrShell = hrShell.replace(
  `const items: ShellNavItem[] = [`,
  `const items: ShellNavItem[] = [`
);
fs.writeFileSync(hrShellPath, hrShell);

// Update createHrModule
fs.writeFileSync(
  path.join(pkgPres, "createHrModule.tsx"),
  `import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { Users } from "lucide-react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { HR_PERMISSIONS } from "../domain/permissions";
import HrShell from "./HrShell";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

export interface HrModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
  UserManagement?: ComponentType;
}

export function createHrModule({ PageTitle, UserManagement }: HrModuleDeps): FrontModule {
  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "HR & People" }),
    createElement(HrShell, { UserManagement })
  );

  return {
    name: "hr",
    routes: [{ path: "/hr", element: routeElement, permission: "employee.read" }] as AppRoute[],
    menu: [{ id: "hr", label: "HR", path: "/hr", icon: Users, permission: "employee.read" }] as MenuItem[],
    permissions: [...HR_PERMISSIONS],
  };
}
`
);

// HrAppRoutes for satellite
fs.writeFileSync(
  path.join(pkgPres, "HrAppRoutes.tsx"),
  `import { Routes, Route } from "react-router-dom";
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
      <Route path="/users/*" element={<UserShell />} />
      <Route path="/loans/*" element={<LoanShell />} />
      <Route path="/leave" element={<LeavePage />} />
      <Route path="/notice" element={<NoticePage />} />
      <Route path="/projects/*" element={<ProjectShell />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}
`
);

// Copy Dashboard from satellite if not in admin pages
const adminDash = path.join(pkgPres, "pages/Dashboard.tsx");
const satDash = path.join(satPages, "Dashboard.tsx");
if (!fs.existsSync(adminDash) && fs.existsSync(satDash)) {
  fs.writeFileSync(adminDash, fixImports(fs.readFileSync(satDash, "utf8")));
}

// Update package index
const indexPath = path.join(ROOT, "packages/modules/hr/src/index.ts");
let index = fs.readFileSync(indexPath, "utf8");
if (!index.includes("HrShell")) {
  index += `\nexport { default as HrShell } from "./presentation/HrShell";\nexport type { HrShellProps } from "./presentation/HrShell";\nexport { default as HrAppRoutes } from "./presentation/HrAppRoutes";\n`;
  fs.writeFileSync(indexPath, index);
}

// Update hr package.json deps
const hrPkgPath = path.join(ROOT, "packages/modules/hr/package.json");
const hrPkg = JSON.parse(fs.readFileSync(hrPkgPath, "utf8"));
Object.assign(hrPkg.dependencies, {
  "@kwim/core": "workspace:*",
  "@tanstack/react-query": "^5.64.1",
  "@tanstack/react-table": "^8.20.5",
  formik: "^2.4.6",
  yup: "^1.6.1",
  zod: "^3.23.8",
});
hrPkg.scripts = { "type-check": "tsc --noEmit" };
hrPkg.devDependencies = {
  "@types/react": "^18.3.18",
  typescript: "^5.7.3",
  vite: "^5.4.10",
};
fs.writeFileSync(hrPkgPath, JSON.stringify(hrPkg, null, 2) + "\n");

// hr tsconfig paths
fs.writeFileSync(
  path.join(ROOT, "packages/modules/hr/tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2020",
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        moduleResolution: "bundler",
        jsx: "react-jsx",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        isolatedModules: true,
        paths: {
          "@kwim/shared-ui": ["../../shared-ui/src/index.ts"],
          "@kwim/core": ["../../core/src/index.ts"],
          "@kwim/api-client": ["../../api-client/src/index.ts"],
          "@kwim/config": ["../../config/src/index.ts"],
        },
      },
      include: ["src"],
    },
    null,
    2
  ) + "\n"
);

fs.writeFileSync(path.join(ROOT, "packages/modules/hr/src/vite-env.d.ts"), '/// <reference types="vite/client" />\n');

// Admin thin shim
for (const entry of fs.readdirSync(adminHr)) {
  if (entry === "index.tsx") continue;
  fs.rmSync(path.join(adminHr, entry), { recursive: true, force: true });
}
fs.writeFileSync(
  path.join(adminHr, "index.tsx"),
  `/**
 * HR module — thin shim to @kwim/modules-hr
 */
import { createHrModule } from "@kwim/modules-hr";
import PageTitle from "@/components/utilitie/PageTitle";
import { UserTabbedView } from "@/modules/user";

export const hrModule = createHrModule({ PageTitle, UserManagement: UserTabbedView });

export {
  employeeApi,
  departmentApi,
  positionApi,
  contractApi,
  leaveApi,
  attendanceApi,
  payrollApi,
  recruitmentApi,
  trainingApi,
  expenseApi,
  idCardTemplateApi,
  HR_PERMISSIONS,
} from "@kwim/modules-hr";
`
);

// Slim apps/hr
fs.writeFileSync(
  path.join(satHr, "App.tsx"),
  `import { AppLayout, type AppLayoutConfig } from "@kwim/shared-ui";
import { HrAppRoutes } from "@kwim/modules-hr";
import { useAuthStore, toAppLayoutUser, createAuthLogoutHandler } from "@kwim/auth";
import { hrModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const config: AppLayoutConfig = {
    appName: "KwimSoft HR",
    menus: hrModuleConfig.menu,
    user: toAppLayoutUser(user),
    onLogout: createAuthLogoutHandler(logout),
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <HrAppRoutes />
    </AppLayout>
  );
}

export default App;
`
);

// Remove apps/hr duplicate api and pages (keep config, assets, components if needed)
if (fs.existsSync(path.join(satHr, "api"))) fs.rmSync(path.join(satHr, "api"), { recursive: true, force: true });
if (fs.existsSync(path.join(satHr, "pages"))) fs.rmSync(path.join(satHr, "pages"), { recursive: true, force: true });

console.log("HR migration complete");
