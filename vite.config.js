import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@components": path.resolve(__dirname, "src/components"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: [
      "06a8cc0c-ad51-4e5f-a746-6d0a592ab522-00-ce1f9uri8qeo.riker.replit.dev",
      "all",
    ],
  },
});
