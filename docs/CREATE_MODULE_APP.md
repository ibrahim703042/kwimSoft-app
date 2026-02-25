# Creating a New Module App

This guide shows you how to create a new module application in the KWIM monorepo.

## Quick Start

Use the provided script to generate a new module app:

```bash
node scripts/create-module-app.js <module-name> <port> [icon]
```

### Examples

```bash
# Create HR module on port 3002 with Users icon
node scripts/create-module-app.js hr 3002 Users

# Create Finance module on port 3003 with DollarSign icon
node scripts/create-module-app.js finance 3003 DollarSign

# Create CRM module on port 3004 with UserCircle icon
node scripts/create-module-app.js crm 3004 UserCircle
```

### Available Lucide Icons

Common icons you can use:
- `Users` - HR, team management
- `DollarSign` - Finance, accounting
- `Package` - Products, inventory
- `ShoppingCart` - Sales, e-commerce
- `Truck` - Transport, logistics
- `Factory` - Manufacturing
- `Warehouse` - Inventory, storage
- `Wrench` - Maintenance, repairs
- `UserCircle` - CRM, customers
- `ShoppingBag` - Procurement, purchasing
- `Droplets` - Car wash, cleaning
- `LayoutGrid` - Dashboard, overview

See full list at: https://lucide.dev/icons/

## Manual Setup

If you prefer to create a module manually:

### 1. Create Directory Structure

```bash
mkdir -p apps/[module-name]/src/{app,config,components}
mkdir -p apps/[module-name]/public
```

### 2. Create package.json

```json
{
  "name": "@kwim/[module-name]",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p [PORT]",
    "build": "next build",
    "start": "next start -p [PORT]",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@kwim/shared-ui": "workspace:*",
    "@kwim/auth": "workspace:*",
    "@kwim/config": "workspace:*",
    "next": "^14.2.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.263.1",
    "zustand": "^4.4.1"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.7.3",
    "eslint": "^9.13.0",
    "eslint-config-next": "^14.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### 3. Create next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@kwim/shared-ui', '@kwim/auth', '@kwim/config'],
  basePath: '/[module-name]',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### 4. Create tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 5. Create Module Configuration

`src/config/module.config.ts`:

```typescript
import { ModuleConfig } from "@kwim/shared-ui";
import { LayoutGrid } from "lucide-react";

export const moduleConfig: ModuleConfig = {
  name: "[module-name]",
  displayName: "[Module Display Name]",
  icon: LayoutGrid,
  baseUrl: "/[module-name]",
  
  // Quick actions in navbar dropdown
  quickActions: [
    {
      icon: LayoutGrid,
      label: "New Item",
      description: "Create a new item",
      href: "/[module-name]/new",
    },
  ],

  // Sidebar menu items
  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutGrid,
      path: "/[module-name]",
    },
    {
      id: "list",
      label: "List View",
      icon: LayoutGrid,
      path: "/[module-name]/list",
    },
  ],

  routes: [],
  permissions: ["[module-name].view", "[module-name].manage"],
};
```

### 6. Create Main Page

`src/app/page.tsx`:

```typescript
"use client";

import { AppShell } from "@kwim/shared-ui";
import { moduleConfig } from "@/config/module.config";
import { usePathname } from "next/navigation";

export default function ModuleDashboard() {
  const pathname = usePathname();

  return (
    <AppShell
      menus={moduleConfig.menu}
      quickActions={moduleConfig.quickActions}
      currentPath={pathname}
      isAuthenticated={true}
      breadcrumbs={
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">{moduleConfig.displayName}</span>
          <span className="text-gray-400">/</span>
          <span className="font-medium">Dashboard</span>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {moduleConfig.displayName} Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your {moduleConfig.name} operations
          </p>
        </div>

        {/* Your content here */}
      </div>
    </AppShell>
  );
}
```

### 7. Create Layout

`src/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "[Module Name] - KWIM",
  description: "Manage your [module] operations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### 8. Create Global Styles

`src/app/globals.css`:

```css
@tailwind base;
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

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

### 9. Create Tailwind Config

`tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared-ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class',
};
```

### 10. Install Dependencies

```bash
pnpm install
```

### 11. Add to Root package.json

Add scripts to root `package.json`:

```json
{
  "scripts": {
    "dev:[module-name]": "pnpm --filter @kwim/[module-name] dev"
  }
}
```

### 12. Run the Module

```bash
pnpm dev:[module-name]
```

## Customizing Your Module

### Add More Menu Items

Edit `src/config/module.config.ts`:

```typescript
menu: [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutGrid,
    path: "/[module-name]",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
    children: [
      {
        id: "sales-report",
        label: "Sales Report",
        path: "/[module-name]/reports/sales",
      },
      {
        id: "inventory-report",
        label: "Inventory Report",
        path: "/[module-name]/reports/inventory",
      },
    ],
  },
],
```

### Add More Quick Actions

```typescript
quickActions: [
  {
    icon: Plus,
    label: "New Order",
    description: "Create a new order",
    shortcut: "⌘N",
    href: "/[module-name]/orders/new",
  },
  {
    icon: Upload,
    label: "Import Data",
    description: "Import from CSV",
    href: "/[module-name]/import",
  },
],
```

### Add New Pages

Create new pages in `src/app/`:

```
src/app/
├── page.tsx              # Dashboard
├── list/
│   └── page.tsx          # List view
├── new/
│   └── page.tsx          # Create form
└── [id]/
    └── page.tsx          # Detail view
```

## Best Practices

1. **Use AppShell** - Always wrap your pages with AppShell for consistent layout
2. **Define Module Config** - Centralize all module metadata in module.config.ts
3. **Follow Naming Conventions** - Use kebab-case for module names
4. **Keep Modules Independent** - Avoid cross-module dependencies
5. **Use Shared Components** - Leverage @kwim/shared-ui components
6. **Document Quick Actions** - Make quick actions intuitive and useful
7. **Test in Isolation** - Each module should work standalone

## Troubleshooting

### Port Already in Use

Change the port in `package.json`:

```json
"dev": "next dev -p 3012"
```

### Module Not Found

Run `pnpm install` from the root directory.

### Shared UI Not Updating

The shared-ui package is imported directly from source, so changes should reflect immediately. If not, restart the dev server.

### TypeScript Errors

Run type check:

```bash
pnpm --filter @kwim/[module-name] type-check
```
