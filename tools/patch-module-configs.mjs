#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODULES = [
  "finance", "crm", "sales", "inventory", "maintenance", "carwash",
  "product", "procurement", "manufacturing",
];

const PRODUCT_PATH = "/products";

for (const name of MODULES) {
  const defaultPath = name === "product" ? PRODUCT_PATH : `/${name}`;
  const Pascal = name.charAt(0).toUpperCase() + name.slice(1);
  const shellPath = path.join(ROOT, "packages/modules", name, "src/presentation", `${Pascal}Shell.tsx`);
  if (!fs.existsSync(shellPath)) continue;
  let content = fs.readFileSync(shellPath, "utf8");
  content = content.replace(
    new RegExp(String.raw`export default function ${Pascal}Shell\(\)`),
    `export default function ${Pascal}Shell({ breadcrumbPath = "${defaultPath}" }: { breadcrumbPath?: string })`
  );
  content = content.replace(
    `breadcrumbPath="${defaultPath}"`,
    "breadcrumbPath={breadcrumbPath}"
  );
  fs.writeFileSync(shellPath, content);
}

// Update admin package.json deps
const adminPkgPath = path.join(ROOT, "apps/admin/package.json");
const adminPkg = JSON.parse(fs.readFileSync(adminPkgPath, "utf8"));
const allModules = ["hr", "transport", ...MODULES];
for (const m of allModules) {
  adminPkg.dependencies[`@kwim/modules-${m}`] = "workspace:*";
}
fs.writeFileSync(adminPkgPath, JSON.stringify(adminPkg, null, 2) + "\n");

// Update admin vite.config.ts aliases
const vitePath = path.join(ROOT, "apps/admin/vite.config.ts");
let vite = fs.readFileSync(vitePath, "utf8");
for (const m of MODULES) {
  if (!vite.includes(`@kwim/modules-${m}`)) {
    vite = vite.replace(
      '"@kwim/utils": path.resolve(__dirname, "../../packages/utils/src"),',
      `"@kwim/modules-${m}": path.resolve(__dirname, "../../packages/modules/${m}/src"),\n      "@kwim/utils": path.resolve(__dirname, "../../packages/utils/src"),`
    );
  }
}
fs.writeFileSync(vitePath, vite);

// Update admin tsconfig.app.json paths
const tsconfigPath = path.join(ROOT, "apps/admin/tsconfig.app.json");
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
for (const m of allModules) {
  tsconfig.compilerOptions.paths[`@kwim/modules-${m}`] = [`../../packages/modules/${m}/src/index.ts`];
}
fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + "\n");

// Update satellite apps
for (const m of MODULES) {
  const appDir = path.join(ROOT, "apps", m);
  if (!fs.existsSync(appDir)) continue;
  const pkgPath = path.join(appDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    pkg.dependencies[`@kwim/modules-${m}`] = "workspace:*";
    if (!pkg.dependencies["@kwim/core"]) pkg.dependencies["@kwim/core"] = "workspace:*";
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  }
  const viteAppPath = path.join(appDir, "vite.config.ts");
  if (fs.existsSync(viteAppPath)) {
    let v = fs.readFileSync(viteAppPath, "utf8");
    const alias = `"@kwim/modules-${m}": path.resolve(__dirname, "../../packages/modules/${m}/src"),`;
    if (!v.includes(`@kwim/modules-${m}`)) {
      v = v.replace(
        '"@kwim/utils": path.resolve(__dirname, "../../packages/utils/src"),',
        `${alias}\n      "@kwim/utils": path.resolve(__dirname, "../../packages/utils/src"),`
      );
    }
    fs.writeFileSync(viteAppPath, v);
  }
  const tsPath = path.join(appDir, "tsconfig.json");
  if (fs.existsSync(tsPath)) {
    const ts = JSON.parse(fs.readFileSync(tsPath, "utf8"));
    ts.compilerOptions.paths[`@kwim/modules-${m}`] = [`../../packages/modules/${m}/src/index.ts`];
    fs.writeFileSync(tsPath, JSON.stringify(ts, null, 2) + "\n");
  }
}

console.log("Patched shells and configs");
