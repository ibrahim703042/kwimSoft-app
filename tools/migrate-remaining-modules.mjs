#!/usr/bin/env node
/**
 * Migrate remaining admin modules: admin-area, user, account, report
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fixImports(content) {
  return content
    .replaceAll("@/core/crud", "@kwim/core")
    .replaceAll("@/core/ui", "@kwim/shared-ui")
    .replaceAll("@/core/auth", "@kwim/auth")
    .replaceAll("@/core/api", "@kwim/modules-user/api")
    .replaceAll("@/components/ui", "@kwim/shared-ui")
    .replaceAll("@/lib/utils", "@kwim/shared-ui")
    .replaceAll('@/config/index', "@kwim/config")
    .replaceAll('@/config"', '@kwim/config"')
    .replaceAll('from "@/config"', 'from "@kwim/config"')
    .replaceAll("API_ROUTE_PASSWORD", "API_CONFIG.userManagement.baseUrl + ''")
    .replaceAll(
      'import profileImg from "@/assets/img/users/avatar.png";',
      ""
    );
}

function copyDir(src, dest, transform = fixImports) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d, transform);
    else if (/\.(tsx?|ts)$/.test(entry.name)) {
      fs.writeFileSync(d, transform(fs.readFileSync(s, "utf8")));
    }
  }
}

function writePkg(name, extraDeps = {}) {
  const pkgRoot = path.join(ROOT, "packages/modules", name);
  fs.writeFileSync(
    path.join(pkgRoot, "package.json"),
    JSON.stringify(
      {
        name: `@kwim/modules-${name}`,
        version: "1.0.0",
        private: true,
        main: "./src/index.ts",
        types: "./src/index.ts",
        exports: { ".": "./src/index.ts", ...(name === "user" ? { "./api": "./src/application/user.api.ts" } : {}) },
        scripts: { "type-check": "tsc --noEmit" },
        dependencies: {
          "@kwim/api-client": "workspace:*",
          "@kwim/auth": "workspace:*",
          "@kwim/config": "workspace:*",
          "@kwim/core": "workspace:*",
          "@kwim/shared-ui": "workspace:*",
          "@tanstack/react-query": "^5.64.1",
          "lucide-react": "^0.469.0",
          ...extraDeps,
        },
        peerDependencies: {
          react: "^18.3.1",
          "react-dom": "^18.3.1",
          "react-router-dom": "^6.28.0",
        },
        devDependencies: {
          "@types/react": "^18.3.18",
          typescript: "^5.7.3",
          vite: "^5.4.10",
        },
      },
      null,
      2
    ) + "\n"
  );
  fs.writeFileSync(
    path.join(pkgRoot, "tsconfig.json"),
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
            "@kwim/auth": ["../../auth/src/index.ts"],
            ...(name === "user"
              ? { "@kwim/modules-user/api": ["./src/application/user.api.ts"] }
              : {}),
          },
        },
        include: ["src"],
      },
      null,
      2
    ) + "\n"
  );
  fs.writeFileSync(path.join(pkgRoot, "src/vite-env.d.ts"), '/// <reference types="vite/client" />\n');
}

function wireAdmin(name, shimContent) {
  const adminMod = path.join(ROOT, "apps/admin/src/modules", name);
  if (!fs.existsSync(adminMod)) fs.mkdirSync(adminMod, { recursive: true });
  for (const entry of fs.readdirSync(adminMod)) {
    const p = path.join(adminMod, entry);
    if (entry === "index.ts" || entry === "index.tsx") continue;
    fs.rmSync(p, { recursive: true, force: true });
  }
  const ext = name === "admin-area" || name === "user" ? "ts" : "tsx";
  fs.writeFileSync(path.join(adminMod, `index.${ext}`), shimContent);
}

function addAdminDeps(names) {
  const pkgPath = path.join(ROOT, "apps/admin/package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  for (const n of names) {
    pkg.dependencies[`@kwim/modules-${n}`] = "workspace:*";
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

  let vite = fs.readFileSync(path.join(ROOT, "apps/admin/vite.config.ts"), "utf8");
  for (const n of names) {
    const alias = `"@kwim/modules-${n}": path.resolve(__dirname, "../../packages/modules/${n}/src"),`;
    if (!vite.includes(`@kwim/modules-${n}`)) {
      vite = vite.replace(
        '"@kwim/utils": path.resolve(__dirname, "../../packages/utils/src"),',
        `${alias}\n      "@kwim/utils": path.resolve(__dirname, "../../packages/utils/src"),`
      );
    }
  }
  fs.writeFileSync(path.join(ROOT, "apps/admin/vite.config.ts"), vite);

  const tsPath = path.join(ROOT, "apps/admin/tsconfig.app.json");
  let ts = fs.readFileSync(tsPath, "utf8");
  for (const n of names) {
    const key = `"@kwim/modules-${n}"`;
    const val = `"../../packages/modules/${n}/src/index.ts"`;
    if (!ts.includes(key)) {
      ts = ts.replace(
        '"@kwim/shared-ui": ["../../packages/shared-ui/src/index.ts"],',
        `"@kwim/modules-${n}": [${val}],\n        "@kwim/shared-ui": ["../../packages/shared-ui/src/index.ts"],`
      );
    }
  }
  fs.writeFileSync(tsPath, ts);
}

// ─── admin-area ───────────────────────────────────────────────
function migrateAdminArea() {
  const name = "admin-area";
  const pkgPres = path.join(ROOT, "packages/modules", name, "src/presentation");
  const adminSrc = path.join(ROOT, "apps/admin/src/modules/admin-area");
  if (fs.existsSync(path.join(ROOT, "packages/modules", name))) {
    fs.rmSync(path.join(ROOT, "packages/modules", name), { recursive: true, force: true });
  }
  fs.mkdirSync(path.join(ROOT, "packages/modules", name, "src/domain"), { recursive: true });

  let platformData = fs.readFileSync(path.join(adminSrc, "platformData.ts"), "utf8");
  platformData = fixImports(platformData);
  platformData = platformData.replace(
    'import { getModules } from "@/app/registerModules";',
    'import { getRegisteredModules } from "../domain/adminAreaContext";'
  );
  platformData = platformData.replace("getModules()", "getRegisteredModules()");
  platformData = platformData.replace('path: "/product"', 'path: "/products"');
  fs.writeFileSync(path.join(ROOT, "packages/modules", name, "src/domain/platformData.ts"), platformData);

  copyDir(path.join(adminSrc, "lib"), path.join(ROOT, "packages/modules", name, "src/domain/lib"));
  copyDir(path.join(adminSrc, "pages"), path.join(pkgPres, "pages"));
  copyDir(path.join(adminSrc, "components"), path.join(pkgPres, "components"));

  for (const f of ["AdminAreaShell.tsx", "AdminAreaTabbedView.tsx"]) {
    let content = fixImports(fs.readFileSync(path.join(adminSrc, f), "utf8"));
    if (f === "AdminAreaShell.tsx") {
      content = content.replace(
        "export default function AdminAreaShell() {",
        "export default function AdminAreaShell({ breadcrumbPath = \"/console\" }: { breadcrumbPath?: string }) {"
      );
      content = content.replace('breadcrumbPath="/console"', "breadcrumbPath={breadcrumbPath}");
    }
    fs.writeFileSync(path.join(pkgPres, f), content);
  }

  // Fix page imports to platformData
  for (const file of fs.readdirSync(path.join(pkgPres, "pages"), { recursive: true })) {
    if (!file.endsWith?.(".tsx") && !String(file).endsWith(".tsx")) continue;
  }
  const fixPlatformImports = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) fixPlatformImports(p);
      else if (entry.name.endsWith(".tsx")) {
        let c = fs.readFileSync(p, "utf8");
        c = c.replaceAll("../platformData", "../../domain/platformData");
        c = c.replaceAll('"../platformData"', '"../../domain/platformData"');
        c = c.replaceAll("../lib/", "../../domain/lib/");
        fs.writeFileSync(p, c);
      }
    }
  };
  fixPlatformImports(path.join(pkgPres, "pages"));

  fs.writeFileSync(
    path.join(ROOT, "packages/modules", name, "src/domain/adminAreaContext.ts"),
    `export type RegisteredModule = { name: string };

let getModulesFn: () => RegisteredModule[] = () => [];

export function configureAdminArea(ctx: { getModules: () => RegisteredModule[] }) {
  getModulesFn = ctx.getModules;
}

export function getRegisteredModules(): RegisteredModule[] {
  return getModulesFn();
}
`
  );

  fs.writeFileSync(
    path.join(ROOT, "packages/modules", name, "src/presentation/createAdminAreaModule.tsx"),
    `import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { configureAdminArea } from "../domain/adminAreaContext";
import AdminAreaShell from "./AdminAreaShell";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
}

export interface AdminAreaModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
  getModules: () => { name: string }[];
}

export function createAdminAreaModule({ PageTitle, getModules }: AdminAreaModuleDeps): FrontModule {
  configureAdminArea({ getModules });

  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "Admin" }),
    createElement(AdminAreaShell)
  );

  return {
    name: "admin-area",
    routes: [{ path: "/console", element: routeElement }] as AppRoute[],
    menu: [] as MenuItem[],
  };
}
`
  );

  fs.writeFileSync(
    path.join(ROOT, "packages/modules", name, "src/index.ts"),
    `export { createAdminAreaModule } from "./presentation/createAdminAreaModule";
export type { FrontModule, AdminAreaModuleDeps } from "./presentation/createAdminAreaModule";
export { default as AdminAreaShell } from "./presentation/AdminAreaShell";
export * from "./domain/platformData";
`
  );

  writePkg(name);
  wireAdmin(
    name,
    `import { createAdminAreaModule } from "@kwim/modules-admin-area";
import PageTitle from "@/components/utilitie/PageTitle";
import { getModules } from "@/app/registerModules";

export const adminAreaModule = createAdminAreaModule({ PageTitle, getModules });

export { AdminAreaShell, AdminAreaTabbedView } from "@kwim/modules-admin-area";
export * from "@kwim/modules-admin-area";
`
  );
  // Fix shim - AdminAreaTabbedView export
  const shimPath = path.join(ROOT, "apps/admin/src/modules/admin-area/index.ts");
  fs.writeFileSync(
    shimPath,
    `import { createAdminAreaModule } from "@kwim/modules-admin-area";
import PageTitle from "@/components/utilitie/PageTitle";
import { getModules } from "@/app/registerModules";

export const adminAreaModule = createAdminAreaModule({ PageTitle, getModules });

export { default as AdminAreaShell } from "@kwim/modules-admin-area/presentation/AdminAreaShell";
export { default as AdminAreaTabbedView } from "@kwim/modules-admin-area/presentation/AdminAreaTabbedView";
export {
  WelcomePage,
  ServerInfoPage,
  ProviderInfoPage,
  AuditLogPage,
  SystemStatusPage,
  GlobalSettingsPage,
} from "@kwim/modules-admin-area/presentation/pages";
`
  );
  console.log("Migrated admin-area");
}

// ─── user ─────────────────────────────────────────────────────
function migrateUser() {
  const name = "user";
  const pkgRoot = path.join(ROOT, "packages/modules", name);
  const adminSrc = path.join(ROOT, "apps/admin/src/modules/user");
  if (fs.existsSync(pkgRoot)) fs.rmSync(pkgRoot, { recursive: true, force: true });

  fs.mkdirSync(path.join(pkgRoot, "src/application"), { recursive: true });
  fs.mkdirSync(path.join(pkgRoot, "src/presentation/pages"), { recursive: true });

  const apiSrc = path.join(ROOT, "apps/admin/src/core/api/userManagementApi.ts");
  fs.writeFileSync(
    path.join(pkgRoot, "src/application/user.api.ts"),
    fixImports(fs.readFileSync(apiSrc, "utf8")).replace(
      'import apiClient from "@kwim/api-client";',
      'import { apiClient } from "@kwim/api-client";'
    )
  );

  copyDir(path.join(adminSrc, "pages"), path.join(pkgRoot, "src/presentation/pages"));
  for (const f of ["UserShell.tsx", "UserTabbedView.tsx"]) {
    fs.writeFileSync(
      path.join(pkgRoot, "src/presentation", f),
      fixImports(fs.readFileSync(path.join(adminSrc, f), "utf8"))
    );
  }

  // Copy EnhancedTable for any page that needs it
  fs.copyFileSync(
    path.join(ROOT, "packages/modules/hr/src/presentation/components/EnhancedTable.tsx"),
    path.join(pkgRoot, "src/presentation/components/EnhancedTable.tsx")
  );

  fs.writeFileSync(
    path.join(pkgRoot, "src/domain/permissions.ts"),
    `export const USER_PERMISSIONS = [
  "user.read", "user.create", "user.update", "user.delete",
] as const;
`
  );

  fs.writeFileSync(
    path.join(pkgRoot, "src/presentation/createUserModule.tsx"),
    `import type { FrontModule, MenuItem, AppRoute } from "@kwim/shared-ui";
import { USER_PERMISSIONS } from "../domain/permissions";

export function createUserModule(): FrontModule {
  return {
    name: "user",
    routes: [] as AppRoute[],
    menu: [] as MenuItem[],
    permissions: [...USER_PERMISSIONS],
  };
}
`
  );

  fs.writeFileSync(
    path.join(pkgRoot, "src/index.ts"),
    `export { USER_PERMISSIONS } from "./domain/permissions";
export * from "./application/user.api";
export { createUserModule } from "./presentation/createUserModule";
export { default as UserShell } from "./presentation/UserShell";
export { default as UserTabbedView } from "./presentation/UserTabbedView";
export { default as UserManagement } from "./presentation/pages/UserManagement";
export { UserNew, GroupNew, RoleNew, UserSessionNew } from "./presentation/pages";
`
  );

  writePkg(name, {
    "@emotion/react": "^11.13.3",
    "@emotion/styled": "^11.13.0",
    "@mui/material": "^6.1.7",
    "@mui/utils": "^6.1.7",
    "@tanstack/react-table": "^8.20.5",
    axios: "^1.7.9",
    formik: "^2.4.6",
    yup: "^1.6.1",
  });

  wireAdmin(
    name,
    `import { createUserModule } from "@kwim/modules-user";

export const userModule = createUserModule();

export {
  UserShell,
  UserTabbedView,
  UserManagement,
  UserNew,
  GroupNew,
  RoleNew,
  UserSessionNew,
  USER_PERMISSIONS,
} from "@kwim/modules-user";
`
  );
  console.log("Migrated user");
}

// ─── account ──────────────────────────────────────────────────
function migrateAccount() {
  const name = "account";
  const pkgRoot = path.join(ROOT, "packages/modules", name);
  const adminSrc = path.join(ROOT, "apps/admin/src/modules/account");
  if (fs.existsSync(pkgRoot)) fs.rmSync(pkgRoot, { recursive: true, force: true });
  fs.mkdirSync(path.join(pkgRoot, "src/presentation"), { recursive: true });

  // Simpler profile - read and rewrite cleanly
  const profile = `import { useAuthStore } from "@kwim/auth";
import { Page, PageHeader, PageContent } from "@kwim/core";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const displayName =
    user?.firstName && user?.lastName
      ? \`\${user.firstName} \${user.lastName}\`
      : user?.username || "—";

  return (
    <Page>
      <PageHeader title="Profile" description="View and manage your account information" />
      <PageContent>
        <div className="max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-6 mb-6">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="rounded-full w-24 h-24 object-cover border-2 border-border" />
            ) : (
              <div className="rounded-full w-24 h-24 bg-muted flex items-center justify-center text-2xl font-semibold text-muted-foreground border-2 border-border">
                {(user?.firstName?.[0] || user?.username?.[0] || "?").toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-foreground">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{user?.email || "—"}</p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <div><span className="text-muted-foreground">Username</span><p className="mt-1">{user?.username || "—"}</p></div>
            <div><span className="text-muted-foreground">Email</span><p className="mt-1">{user?.email || "—"}</p></div>
            {user?.tenantCode && <div><span className="text-muted-foreground">Tenant</span><p className="mt-1">{user.tenantCode}</p></div>}
            {user?.roles?.length ? <div><span className="text-muted-foreground">Roles</span><p className="mt-1">{user.roles.join(", ")}</p></div> : null}
          </div>
        </div>
      </PageContent>
    </Page>
  );
}
`;

  let settings = fixImports(fs.readFileSync(path.join(adminSrc, "SettingsPage.tsx"), "utf8"));
  settings = settings.replace(
    "import { Page, PageHeader, PageContent } from \"@kwim/shared-ui\";",
    "import { Page, PageHeader, PageContent } from \"@kwim/core\";"
  );

  fs.writeFileSync(path.join(pkgRoot, "src/presentation/ProfilePage.tsx"), profile);
  fs.writeFileSync(path.join(pkgRoot, "src/presentation/SettingsPage.tsx"), settings);
  fs.writeFileSync(
    path.join(pkgRoot, "src/index.ts"),
    `export { default as ProfilePage } from "./presentation/ProfilePage";
export { default as SettingsPage } from "./presentation/SettingsPage";
`
  );
  writePkg(name);

  fs.rmSync(adminSrc, { recursive: true, force: true });
  fs.mkdirSync(adminSrc, { recursive: true });
  fs.writeFileSync(
    path.join(adminSrc, "index.ts"),
    `export { ProfilePage, SettingsPage } from "@kwim/modules-account";
`
  );
  console.log("Migrated account");
}

// ─── report ───────────────────────────────────────────────────
function migrateReport() {
  const name = "report";
  const pkgRoot = path.join(ROOT, "packages/modules", name);
  if (fs.existsSync(pkgRoot)) fs.rmSync(pkgRoot, { recursive: true, force: true });
  fs.mkdirSync(path.join(pkgRoot, "src/presentation/pages"), { recursive: true });

  fs.writeFileSync(
    path.join(pkgRoot, "src/presentation/pages/ReportsPage.tsx"),
    `import { z } from "zod";
import { createFullEntityPage } from "@kwim/core";

export default createFullEntityPage({
  key: "report",
  title: "Reports",
  singular: "Report",
  endpoint: "/report",
  service: "transport",
  permissionPrefix: "report",
  columns: [
    { header: "Report #", accessorKey: "reportNumber" },
    { header: "Title", accessorKey: "title" },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }: { row: { original: { type?: string } } }) =>
        String(row.original.type ?? "").replace(/_/g, " ").toUpperCase(),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }: { row: { original: { status?: string } } }) => {
        const s = row.original.status ?? "";
        const colors: Record<string, string> = {
          pending: "text-blue-600",
          generating: "text-yellow-600",
          completed: "text-green-600",
          failed: "text-red-600",
        };
        return <span className={\`font-medium \${colors[s] || ""}\`}>{s.toUpperCase()}</span>;
      },
    },
  ],
  formFields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "type", label: "Type", type: "text" },
    { name: "format", label: "Format", type: "text" },
  ],
  formSchema: z.object({
    title: z.string().min(1),
    type: z.string().optional(),
    format: z.string().optional(),
  }),
  defaultValues: { title: "", type: "", format: "json" },
});
`
  );

  fs.writeFileSync(
    path.join(pkgRoot, "src/presentation/ReportShell.tsx"),
    `import { BarChart3, LayoutDashboard } from "lucide-react";
import { ModuleShell, ShellNavItem } from "@kwim/shared-ui";
import ReportsPage from "./pages/ReportsPage";

const items: ShellNavItem[] = [
  { key: "reports", label: "Reports", icon: BarChart3, component: ReportsPage },
];

export default function ReportShell({ breadcrumbPath = "/reports" }: { breadcrumbPath?: string }) {
  return (
    <ModuleShell title="Reports" breadcrumbPath={breadcrumbPath} items={items} enableSearch />
  );
}
`
  );

  fs.writeFileSync(
    path.join(pkgRoot, "src/domain/permissions.ts"),
    `export const REPORT_PERMISSIONS = ["report.read", "report.create", "report.update", "report.delete"] as const;
`
  );

  fs.writeFileSync(
    path.join(pkgRoot, "src/presentation/createReportModule.tsx"),
    `import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
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
    menu: [{ id: "report", label: "Reports", path: "/reports", icon: BarChart3, permission: "report.read" }] as MenuItem[],
    permissions: [...REPORT_PERMISSIONS],
  };
}
`
  );

  fs.writeFileSync(
    path.join(pkgRoot, "src/index.ts"),
    `export { REPORT_PERMISSIONS } from "./domain/permissions";
export { createReportModule } from "./presentation/createReportModule";
export type { ReportModuleDeps } from "./presentation/createReportModule";
export { default as ReportShell } from "./presentation/ReportShell";
`
  );

  writePkg(name, { zod: "^3.23.8" });

  wireAdmin(
    name,
    `import { createReportModule } from "@kwim/modules-report";
import PageTitle from "@/components/utilitie/PageTitle";

export const reportModule = createReportModule({ PageTitle });

export { REPORT_PERMISSIONS } from "@kwim/modules-report";
`
  );
  console.log("Migrated report");
}

migrateAdminArea();
migrateUser();
migrateAccount();
migrateReport();

// Update HR shim to use @kwim/modules-user
const hrShim = path.join(ROOT, "apps/admin/src/modules/hr/index.tsx");
let hr = fs.readFileSync(hrShim, "utf8");
hr = hr.replace(
  'import { UserTabbedView } from "@/modules/user";',
  'import { UserTabbedView } from "@kwim/modules-user";'
);
fs.writeFileSync(hrShim, hr);

// Update Router for account
const routerPath = path.join(ROOT, "apps/admin/src/app/Router.tsx");
let router = fs.readFileSync(routerPath, "utf8");
router = router.replace(
  'import ProfilePage from "@/modules/account/ProfilePage";',
  'import { ProfilePage } from "@kwim/modules-account";'
);
router = router.replace(
  'import SettingsPage from "@/modules/account/SettingsPage";',
  'import { SettingsPage } from "@kwim/modules-account";'
);
fs.writeFileSync(routerPath, router);

addAdminDeps(["admin-area", "user", "account", "report"]);
console.log("Remaining modules migration complete");
