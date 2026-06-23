import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";
import { existsSync, readFileSync, readdirSync } from "node:fs";

// https://vitejs.dev/config/
// Load .env from monorepo root so VITE_API_HOST and VITE_API_PROD_HOST are used
const rootDir = path.resolve(__dirname, "../..");
const adminNodeModules = path.resolve(__dirname, "node_modules");
const sharedUiDir = path.resolve(__dirname, "../../packages/shared-ui/src");
const sharedUiComponentsDir = path.join(sharedUiDir, "components/ui");

/** Subpath imports like @kwim/shared-ui/button used across module packages. */
function sharedUiSubpathAliases(): Record<string, string> {
  const aliases: Record<string, string> = {
    "@kwim/shared-ui/ui": path.join(sharedUiComponentsDir, "index.ts"),
  };
  if (existsSync(sharedUiComponentsDir)) {
    for (const file of readdirSync(sharedUiComponentsDir)) {
      if (/\.tsx?$/.test(file)) {
        const name = file.replace(/\.tsx?$/, "");
        aliases[`@kwim/shared-ui/${name}`] = path.join(sharedUiComponentsDir, file);
      }
    }
  }
  return aliases;
}

/** Resolve bare imports from workspace module sources via the admin app's runtime dependencies. */
function adminDependencyAliases(): Record<string, string> {
  const pkg = JSON.parse(readFileSync(path.join(__dirname, "package.json"), "utf8")) as {
    dependencies?: Record<string, string>;
  };
  const aliases: Record<string, string> = {};
  for (const name of Object.keys(pkg.dependencies ?? {})) {
    if (name.startsWith("@kwim/")) continue;
    const target = path.join(adminNodeModules, name);
    if (existsSync(target)) {
      aliases[name] = target;
    }
  }
  return aliases;
}

export default defineConfig({
  envDir: rootDir,
  plugins: [
    react(),
    svgr(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      ...sharedUiSubpathAliases(),
      "@kwim/shared-ui": sharedUiDir,
      "@kwim/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@kwim/core": path.resolve(__dirname, "../../packages/core/src"),
      "@kwim/auth": path.resolve(__dirname, "../../packages/auth/src"),
      "@kwim/api-client": path.resolve(__dirname, "../../packages/api-client/src"),
      "@kwim/config": path.resolve(__dirname, "../../packages/config/src"),
      "@kwim/modules-hr": path.resolve(__dirname, "../../packages/modules/hr/src"),
      "@kwim/modules-transport": path.resolve(__dirname, "../../packages/modules/transport/src"),
      "@kwim/modules-finance": path.resolve(__dirname, "../../packages/modules/finance/src"),
      "@kwim/modules-crm": path.resolve(__dirname, "../../packages/modules/crm/src"),
      "@kwim/modules-sales": path.resolve(__dirname, "../../packages/modules/sales/src"),
      "@kwim/modules-inventory": path.resolve(__dirname, "../../packages/modules/inventory/src"),
      "@kwim/modules-maintenance": path.resolve(__dirname, "../../packages/modules/maintenance/src"),
      "@kwim/modules-carwash": path.resolve(__dirname, "../../packages/modules/carwash/src"),
      "@kwim/modules-product": path.resolve(__dirname, "../../packages/modules/product/src"),
      "@kwim/modules-procurement": path.resolve(__dirname, "../../packages/modules/procurement/src"),
      "@kwim/modules-manufacturing": path.resolve(__dirname, "../../packages/modules/manufacturing/src"),
      "@kwim/modules-admin-area": path.resolve(__dirname, "../../packages/modules/admin-area/src"),
      "@kwim/modules-user": path.resolve(__dirname, "../../packages/modules/user/src"),
      "@kwim/modules-account": path.resolve(__dirname, "../../packages/modules/account/src"),
      "@kwim/modules-report": path.resolve(__dirname, "../../packages/modules/report/src"),
      "@kwim/utils": path.resolve(__dirname, "../../packages/utils/src"),
      ...adminDependencyAliases(),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
