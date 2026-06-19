import path from "node:path";
import { fileURLToPath } from "node:url";
import sharedPreset from "../../packages/shared-ui/tailwind.preset.cjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  presets: [sharedPreset],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    path.join(__dirname, "../../packages/shared-ui/src/**/*.{js,ts,jsx,tsx}"),
    path.join(__dirname, "../../packages/core/src/**/*.{js,ts,jsx,tsx}"),
  ],
};