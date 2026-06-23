#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODULES = [
  "finance", "crm", "sales", "inventory", "maintenance", "carwash",
  "product", "procurement", "manufacturing", "transport",
];

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

  const vitePath = path.join(appDir, "vite.config.ts");
  if (fs.existsSync(vitePath)) {
    let v = fs.readFileSync(vitePath, "utf8");
    const needle = `"@kwim/modules-${m}":`;
    if (!v.includes(needle)) {
      v = v.replace(
        /"@kwim\/utils": path\.resolve\(__dirname, "\.\.\/\.\.\/packages\/utils\/src"\),/,
        `"@kwim/modules-${m}": path.resolve(__dirname, "../../packages/modules/${m}/src"),\n      "@kwim/utils": path.resolve(__dirname, "../../packages/utils/src"),`
      );
      fs.writeFileSync(vitePath, v);
    }
  }

  const tsPath = path.join(appDir, "tsconfig.json");
  if (fs.existsSync(tsPath)) {
    let raw = fs.readFileSync(tsPath, "utf8");
    const key = `"@kwim/modules-${m}"`;
    if (!raw.includes(key)) {
      raw = raw.replace(
        /"@kwim\/utils": \["\.\.\/\.\.\/packages\/utils\/src\/index\.ts"\]/,
        `"@kwim/modules-${m}": ["../../packages/modules/${m}/src/index.ts"],\n      "@kwim/utils": ["../../packages/utils/src/index.ts"]`
      );
      fs.writeFileSync(tsPath, raw);
    }
  }
}
console.log("Satellite configs updated");
