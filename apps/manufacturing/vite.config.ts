import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@kwim/shared-ui": path.resolve(__dirname, "../../packages/shared-ui/src"),
      "@kwim/auth": path.resolve(__dirname, "../../packages/auth/src"),
      "@kwim/config": path.resolve(__dirname, "../../packages/config/src"),
      "@kwim/api-client": path.resolve(__dirname, "../../packages/api-client/src"),
      "@kwim/utils": path.resolve(__dirname, "../../packages/utils/src"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  server: {
    host: "0.0.0.0",
    port: 3008,
  },
});
