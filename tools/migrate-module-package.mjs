#!/usr/bin/env node
/**
 * Migrate an admin module to packages/modules/{name}
 * Usage: node tools/migrate-module-package.mjs finance
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const MODULE_META = {
  finance: {
    icon: "DollarSign",
    pageTitle: "Finance",
    shellTitle: "Finance & Comptabilité",
    readPerm: "account.read",
    permissions: [
      "account.read", "account.create", "account.update", "account.delete",
      "invoice.read", "invoice.create", "invoice.update", "invoice.delete",
      "payment.read", "payment.create", "payment.update", "payment.delete",
      "budget.read", "budget.create", "budget.update", "budget.delete",
      "journal_entry.read", "journal_entry.create", "journal_entry.update", "journal_entry.delete",
      "tax_config.read", "tax_config.create", "tax_config.update", "tax_config.delete",
    ],
  },
  crm: {
    icon: "Contact",
    pageTitle: "CRM",
    shellTitle: "CRM",
    readPerm: "contact.read",
    permissions: [
      "contact.read", "contact.create", "contact.update", "contact.delete",
      "lead.read", "lead.create", "lead.update", "lead.delete",
      "opportunity.read", "opportunity.create", "opportunity.update", "opportunity.delete",
      "campaign.read", "campaign.create", "campaign.update", "campaign.delete",
      "activity.read", "activity.create", "activity.update", "activity.delete",
    ],
  },
  sales: {
    icon: "TrendingUp",
    pageTitle: "Sales",
    shellTitle: "Ventes",
    readPerm: "customer.read",
    permissions: [
      "customer.read", "customer.create", "customer.update", "customer.delete",
      "order.read", "order.create", "order.update", "order.delete",
      "quotation.read", "quotation.create", "quotation.update", "quotation.delete",
      "sales_team.read", "sales_team.create", "sales_team.update", "sales_team.delete",
      "pricing_rule.read", "pricing_rule.create", "pricing_rule.update", "pricing_rule.delete",
    ],
  },
  inventory: {
    icon: "Warehouse",
    pageTitle: "Inventory",
    shellTitle: "Inventaire & Entrepôt",
    readPerm: "warehouse.read",
    permissions: [
      "warehouse.read", "warehouse.create", "warehouse.update", "warehouse.delete",
      "location.read", "location.create", "location.update", "location.delete",
      "stock.read", "stock.create", "stock.update", "stock.delete",
      "stock_movement.read", "stock_movement.create", "stock_movement.update", "stock_movement.delete",
      "transfer.read", "transfer.create", "transfer.update", "transfer.delete",
      "inventory_count.read", "inventory_count.create", "inventory_count.update", "inventory_count.delete",
    ],
  },
  maintenance: {
    icon: "Wrench",
    pageTitle: "Maintenance",
    shellTitle: "Maintenance de flotte",
    readPerm: "maintenance.read",
    permissions: [
      "maintenance.read", "maintenance.create", "maintenance.update", "maintenance.delete",
      "inspection.read", "inspection.create", "inspection.update", "inspection.delete",
    ],
  },
  carwash: {
    icon: "Droplets",
    pageTitle: "Carwash",
    shellTitle: "Carwash",
    readPerm: "wash_service.read",
    permissions: [
      "wash_service.read", "wash_service.create", "wash_service.update", "wash_service.delete",
      "bay.read", "bay.create", "bay.update", "bay.delete",
      "wash_order.read", "wash_order.create", "wash_order.update", "wash_order.delete",
    ],
  },
  product: {
    icon: "Package",
    pageTitle: "Products",
    shellTitle: "Gestion des produits",
    routePath: "/products",
    readPerm: "product.read",
    permissions: [
      "category.read", "category.create", "category.update", "category.delete",
      "sub_category.read", "sub_category.create", "sub_category.update", "sub_category.delete",
      "brand.read", "brand.create", "brand.update", "brand.delete",
      "product.read", "product.create", "product.update", "product.delete",
      "attribute.read", "attribute.create", "attribute.update", "attribute.delete",
      "product_tag.read", "product_tag.create", "product_tag.update", "product_tag.delete",
      "product_bundle.read", "product_bundle.create", "product_bundle.update", "product_bundle.delete",
      "product_price.read", "product_price.create", "product_price.update", "product_price.delete",
      "product_review.read", "product_review.create", "product_review.update", "product_review.delete",
    ],
  },
  procurement: {
    icon: "ShoppingCart",
    pageTitle: "Procurement",
    shellTitle: "Achats",
    readPerm: "supplier.read",
    permissions: [
      "supplier.read", "supplier.create", "supplier.update", "supplier.delete",
      "purchase_requisition.read", "purchase_requisition.create", "purchase_requisition.update", "purchase_requisition.delete",
      "purchase_order.read", "purchase_order.create", "purchase_order.update", "purchase_order.delete",
      "rfq.read", "rfq.create", "rfq.update", "rfq.delete",
      "goods_receipt.read", "goods_receipt.create", "goods_receipt.update", "goods_receipt.delete",
    ],
  },
  manufacturing: {
    icon: "Factory",
    pageTitle: "Manufacturing",
    shellTitle: "Fabrication",
    readPerm: "manufacturing_order.read",
    permissions: [
      "bom.read", "bom.create", "bom.update", "bom.delete",
      "manufacturing_order.read", "manufacturing_order.create", "manufacturing_order.update", "manufacturing_order.delete",
      "work_center.read", "work_center.create", "work_center.update", "work_center.delete",
      "operation.read", "operation.create", "operation.update", "operation.delete",
      "quality_check.read", "quality_check.create", "quality_check.update", "quality_check.delete",
    ],
  },
};

function pascal(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function fixImports(content, moduleName) {
  return content
    .replaceAll("@/core/crud", "@kwim/core")
    .replaceAll("@/core/ui", "@kwim/shared-ui")
    .replaceAll("@/components/ui", "@kwim/shared-ui")
    .replaceAll(`from "../api/${moduleName}.api"`, `from "../../application/${moduleName}.api"`)
    .replaceAll(`from "./api/${moduleName}.api"`, `from "../application/${moduleName}.api"`)
    .replaceAll(`from "../user"`, `from "@kwim/modules-user"`);
}

function copyDir(src, dest, transform) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, transform);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      let content = fs.readFileSync(srcPath, "utf8");
      if (transform) content = transform(content);
      fs.writeFileSync(destPath, content);
    }
  }
}

function migrateModule(name) {
  const meta = MODULE_META[name];
  if (!meta) throw new Error(`Unknown module: ${name}`);

  const Pascal = pascal(name);
  const adminMod = path.join(ROOT, "apps/admin/src/modules", name);
  const pkgRoot = path.join(ROOT, "packages/modules", name);
  const srcRoot = path.join(pkgRoot, "src");
  const routePath = meta.routePath ?? `/${name}`;
  const shellFile = `${Pascal}Shell.tsx`;
  const apiFile = `${name}.api.ts`;

  if (!fs.existsSync(adminMod)) {
    console.log(`Skip ${name}: admin module not found`);
    return;
  }

  // Clean package dir
  if (fs.existsSync(pkgRoot)) fs.rmSync(pkgRoot, { recursive: true, force: true });
  fs.mkdirSync(path.join(srcRoot, "domain"), { recursive: true });
  fs.mkdirSync(path.join(srcRoot, "application"), { recursive: true });
  fs.mkdirSync(path.join(srcRoot, "presentation/pages"), { recursive: true });

  const transform = (c) => fixImports(c, name);

  // API
  const apiSrc = path.join(adminMod, "api", apiFile);
  if (fs.existsSync(apiSrc)) {
    fs.writeFileSync(path.join(srcRoot, "application", apiFile), transform(fs.readFileSync(apiSrc, "utf8")));
  }

  // Shell
  const shellSrc = path.join(adminMod, shellFile);
  if (fs.existsSync(shellSrc)) {
    fs.writeFileSync(
      path.join(srcRoot, "presentation", shellFile),
      transform(fs.readFileSync(shellSrc, "utf8"))
    );
  }

  // Pages
  copyDir(path.join(adminMod, "pages"), path.join(srcRoot, "presentation/pages"), transform);

  // permissions.ts
  const permLines = meta.permissions.map((p) => `  "${p}",`).join("\n");
  fs.writeFileSync(
    path.join(srcRoot, "domain/permissions.ts"),
    `export const ${name.toUpperCase()}_PERMISSIONS = [\n${permLines}\n] as const;\n`
  );

  // createModule factory
  fs.writeFileSync(
    path.join(srcRoot, "presentation", `create${Pascal}Module.tsx`),
    `import { createElement, Fragment, type ComponentType, type ReactNode } from "react";
import { ${meta.icon} } from "lucide-react";
import type { AppRoute, MenuItem } from "@kwim/shared-ui";
import { ${name.toUpperCase()}_PERMISSIONS } from "../domain/permissions";
import ${Pascal}Shell from "./${shellFile.replace(".tsx", "")}";

export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

export interface ${Pascal}ModuleDeps {
  PageTitle: ComponentType<{ title: string }>;
}

export function create${Pascal}Module({ PageTitle }: ${Pascal}ModuleDeps): FrontModule {
  const routeElement: ReactNode = createElement(
    Fragment,
    null,
    createElement(PageTitle, { title: "${meta.pageTitle}" }),
    createElement(${Pascal}Shell)
  );

  return {
    name: "${name}",
    routes: [
      { path: "${routePath}", element: routeElement, permission: "${meta.readPerm}" },
    ] as AppRoute[],
    menu: [
      { id: "${name}", label: "${meta.pageTitle}", path: "${routePath}", icon: ${meta.icon}, permission: "${meta.readPerm}" },
    ] as MenuItem[],
    permissions: [...${name.toUpperCase()}_PERMISSIONS],
  };
}
`
  );

  // index.ts
  const apiExports = fs.existsSync(apiSrc)
    ? `export * from "./application/${apiFile.replace(".ts", "")}";\n`
    : "";
  fs.writeFileSync(
    path.join(srcRoot, "index.ts"),
    `export { ${name.toUpperCase()}_PERMISSIONS } from "./domain/permissions";
${apiExports}export { create${Pascal}Module } from "./presentation/create${Pascal}Module";
export type { FrontModule, ${Pascal}ModuleDeps } from "./presentation/create${Pascal}Module";
export { default as ${Pascal}Shell } from "./presentation/${shellFile.replace(".tsx", "")}";
`
  );

  // package.json
  fs.writeFileSync(
    path.join(pkgRoot, "package.json"),
    JSON.stringify(
      {
        name: `@kwim/modules-${name}`,
        version: "1.0.0",
        private: true,
        main: "./src/index.ts",
        types: "./src/index.ts",
        exports: { ".": "./src/index.ts" },
        scripts: { "type-check": "tsc --noEmit" },
        dependencies: {
          "@kwim/api-client": "workspace:*",
          "@kwim/config": "workspace:*",
          "@kwim/core": "workspace:*",
          "@kwim/shared-ui": "workspace:*",
          "@tanstack/react-query": "^5.64.1",
          "@tanstack/react-table": "^8.20.5",
          "lucide-react": "^0.469.0",
          zod: "^3.23.8",
        },
        peerDependencies: {
          react: "^18.3.1",
          "react-dom": "^18.3.1",
          "react-router-dom": "^6.28.0",
        },
        devDependencies: {
          "@types/react": "^18.3.18",
          "@types/react-dom": "^18.3.5",
          typescript: "^5.7.3",
          vite: "^5.4.10",
        },
      },
      null,
      2
    ) + "\n"
  );

  // tsconfig.json
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
            "@kwim/shared-ui/*": ["../../shared-ui/src/*"],
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

  fs.writeFileSync(path.join(srcRoot, "vite-env.d.ts"), '/// <reference types="vite/client" />\n');

  // Admin thin shim
  const apiReexport = fs.existsSync(apiSrc) ? `export * from "@kwim/modules-${name}";\n` : "";
  const adminShim = `/**
 * ${Pascal} module — thin shim to @kwim/modules-${name}
 */
import { create${Pascal}Module } from "@kwim/modules-${name}";
import PageTitle from "@/components/utilitie/PageTitle";

export const ${name}Module = create${Pascal}Module({ PageTitle });

export { ${name.toUpperCase()}_PERMISSIONS } from "@kwim/modules-${name}";
${apiReexport}`;

  // Remove old admin files except we'll rewrite index
  for (const entry of fs.readdirSync(adminMod)) {
    if (entry === "index.tsx") continue;
    const p = path.join(adminMod, entry);
    fs.rmSync(p, { recursive: true, force: true });
  }
  fs.writeFileSync(path.join(adminMod, "index.tsx"), adminShim);

  // Satellite app
  const satApp = path.join(ROOT, "apps", name, "src", "App.tsx");
  if (fs.existsSync(satApp)) {
    const satAppContent = `import { AppLayout, type AppLayoutConfig } from "@kwim/shared-ui";
import { ${Pascal}Shell } from "@kwim/modules-${name}";
import { useAuthStore, toAppLayoutUser, createAuthLogoutHandler } from "@kwim/auth";
import { ${name}ModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const config: AppLayoutConfig = {
    appName: "KwimSoft ${Pascal}",
    menus: ${name}ModuleConfig.menu,
    user: toAppLayoutUser(user),
    onLogout: createAuthLogoutHandler(logout),
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <${Pascal}Shell breadcrumbPath="/" />
    </AppLayout>
  );
}

export default App;
`;
    fs.writeFileSync(satApp, satAppContent);
  }

  console.log(`Migrated: ${name}`);
}

const modules = process.argv.slice(2);
if (modules.length === 0) {
  console.error("Usage: node tools/migrate-module-package.mjs finance crm ...");
  process.exit(1);
}
for (const m of modules) migrateModule(m);
