#!/usr/bin/env node

/**
 * Script to create a new Vite/React module app
 * Usage: node scripts/create-vite-module-app.js <module-name> <port> <icon>
 * Example: node scripts/create-vite-module-app.js hr 3002 Users
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node scripts/create-vite-module-app.js <module-name> <port> [icon]');
  console.error('Example: node scripts/create-vite-module-app.js hr 3002 Users');
  process.exit(1);
}

const [moduleName, port, iconName = 'LayoutGrid'] = args;
const appDir = path.join(rootDir, 'apps', moduleName);
const displayName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

// Check if app already exists
if (fs.existsSync(appDir)) {
  console.error(`App already exists: ${appDir}`);
  process.exit(1);
}

console.log(`Creating ${moduleName} module app (Vite/React)...`);

// Create directory structure
const dirs = [
  'src/pages',
  'src/config',
  'src/components',
  'src/assets',
  'public',
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(appDir, dir), { recursive: true });
});

// 1. package.json
const packageJson = {
  name: `@kwim/${moduleName}`,
  version: '1.0.0',
  private: true,
  type: 'module',
  scripts: {
    dev: `vite --port ${port}`,
    build: 'vite build',
    preview: 'vite preview',
    lint: 'eslint src',
    'type-check': 'tsc --noEmit',
  },
  dependencies: {
    '@kwim/shared-ui': 'workspace:*',
    '@kwim/auth': 'workspace:*',
    '@kwim/config': 'workspace:*',
    '@kwim/api-client': 'workspace:*',
    '@kwim/utils': 'workspace:*',
    react: '^18.3.1',
    'react-dom': '^18.3.1',
    'react-router-dom': '^6.28.0',
    'lucide-react': '^0.469.0',
    zustand: '^5.0.3',
  },
  devDependencies: {
    '@types/react': '^18.3.18',
    '@types/react-dom': '^18.3.5',
    '@vitejs/plugin-react': '^4.3.3',
    vite: '^5.4.10',
    'vite-tsconfig-paths': '^5.1.4',
    typescript: '^5.7.3',
    eslint: '^9.13.0',
    tailwindcss: '^3.4.14',
    postcss: '^8.4.47',
    autoprefixer: '^10.4.20',
  },
};

fs.writeFileSync(
  path.join(appDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

// 2. vite.config.ts
const viteConfig = `import { defineConfig } from "vite";
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
    port: ${port},
  },
});
`;

fs.writeFileSync(path.join(appDir, 'vite.config.ts'), viteConfig);

// 3. tsconfig.json
const tsConfig = {
  compilerOptions: {
    target: 'ES2020',
    useDefineForClassFields: true,
    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
    module: 'ESNext',
    skipLibCheck: true,
    baseUrl: './src',
    moduleResolution: 'bundler',
    allowImportingTsExtensions: true,
    isolatedModules: true,
    moduleDetection: 'force',
    noEmit: true,
    jsx: 'react-jsx',
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
    paths: {
      '@/*': ['./*'],
      '@kwim/shared-ui': ['../../packages/shared-ui/src/index.ts'],
      '@kwim/shared-ui/*': ['../../packages/shared-ui/src/*'],
    },
  },
  include: ['src'],
  exclude: ['node_modules'],
};

fs.writeFileSync(
  path.join(appDir, 'tsconfig.json'),
  JSON.stringify(tsConfig, null, 2)
);

// 4. tailwind.config.js
const tailwindCfg = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/shared-ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class',
};
`;

fs.writeFileSync(path.join(appDir, 'tailwind.config.js'), tailwindCfg);

// 5. postcss.config.js
const postcssCfg = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

fs.writeFileSync(path.join(appDir, 'postcss.config.js'), postcssCfg);

// 6. .gitignore
const gitignore = `node_modules
dist
dist-ssr
*.local
.DS_Store
`;

fs.writeFileSync(path.join(appDir, '.gitignore'), gitignore);

// 7. index.html
const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${displayName} - KWIM</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

fs.writeFileSync(path.join(appDir, 'index.html'), indexHtml);

// 8. src/config/module.config.ts
const moduleCfg = `import { ModuleConfig } from "@kwim/shared-ui";
import { ${iconName} } from "lucide-react";

export const ${moduleName}ModuleConfig: ModuleConfig = {
  name: "${moduleName}",
  displayName: "${displayName} Management",
  icon: ${iconName},
  baseUrl: "/${moduleName}",
  
  quickActions: [
    {
      icon: ${iconName},
      label: "New ${displayName}",
      description: "Create a new ${moduleName} record",
      onClick: () => console.log("New ${moduleName}"),
    },
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: ${iconName},
      path: "/",
    },
  ],

  routes: [],
  permissions: ["${moduleName}.view", "${moduleName}.manage"],
};
`;

fs.writeFileSync(path.join(appDir, 'src/config/module.config.ts'), moduleCfg);

// 9. src/main.tsx
const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
`;

fs.writeFileSync(path.join(appDir, 'src/main.tsx'), mainTsx);

// 10. src/App.tsx
const appTsx = `import { AppShell } from "@kwim/shared-ui";
import { ${moduleName}ModuleConfig } from "@/config/module.config";
import { useLocation, NavLink } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  const location = useLocation();

  return (
    <AppShell
      menus={${moduleName}ModuleConfig.menu}
      quickActions={${moduleName}ModuleConfig.quickActions}
      currentPath={location.pathname}
      isAuthenticated={true}
      LinkComponent={NavLink}
      breadcrumbs={
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">${displayName}</span>
          <span className="text-gray-400">/</span>
          <span className="font-medium">Dashboard</span>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </AppShell>
  );
}

export default App;
`;

fs.writeFileSync(path.join(appDir, 'src/App.tsx'), appTsx);

// 11. src/pages/Dashboard.tsx
const dashboardTsx = `export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          ${displayName} Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your ${moduleName} operations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Items" value="0" />
        <StatCard title="Active" value="0" />
        <StatCard title="Pending" value="0" />
        <StatCard title="Completed" value="0" />
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to ${displayName}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Start managing your ${moduleName} data here.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
`;

fs.writeFileSync(path.join(appDir, 'src/pages/Dashboard.tsx'), dashboardTsx);

// 12. src/index.css
const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --border: 217.2 32.6% 17.5%;
  }
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;

fs.writeFileSync(path.join(appDir, 'src/index.css'), indexCss);

console.log(`✅ Created ${moduleName} app at ${appDir}`);
console.log(`   Port: ${port}`);
console.log(`   URL: http://localhost:${port}`);
console.log('');
console.log('Next steps:');
console.log('  1. Run: pnpm install');
console.log(`  2. Run: pnpm --filter @kwim/${moduleName} dev`);
