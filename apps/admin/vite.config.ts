import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vitejs.dev/config/
// Load .env from monorepo root so VITE_API_HOST and VITE_API_PROD_HOST are used
const rootDir = path.resolve(__dirname, "../..");

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
      "@/config": "@kwim/config",
      "@kwim/shared-ui": path.resolve(__dirname, "../../packages/shared-ui/src"),
      "@kwim/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@kwim/core": path.resolve(__dirname, "../../packages/core/src"),
      "@kwim/auth": path.resolve(__dirname, "../../packages/auth/src"),
      "@kwim/api-client": path.resolve(__dirname, "../../packages/api-client/src"),
      "@kwim/config": path.resolve(__dirname, "../../packages/config/src"),
      "@kwim/utils": path.resolve(__dirname, "../../packages/utils/src"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
