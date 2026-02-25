# Monorepo Architecture - Module-Based Applications

## Overview

This project has been transformed from a monolithic admin application into a Next.js-based monorepo where each business module (Transport, HR, Products, Finance, CRM, etc.) is its own independent application with its own URL.

## Architecture

```
kwim-monorepo/
├── apps/
│   ├── admin/              # Original Vite/React admin app (legacy)
│   ├── transport/          # Transport module Next.js app
│   ├── hr/                 # HR module Next.js app (to be created)
│   ├── products/           # Products module Next.js app (to be created)
│   ├── finance/            # Finance module Next.js app (to be created)
│   ├── crm/                # CRM module Next.js app (to be created)
│   └── ...                 # Other module apps
├── packages/
│   ├── shared-ui/          # Shared UI components (Sidebar, Navbar, AppShell)
│   ├── auth/               # Shared authentication logic
│   ├── config/             # Shared configuration
│   ├── api-client/         # Shared API client
│   └── utils/              # Shared utilities
└── pnpm-workspace.yaml
```

## Shared UI Package

The `@kwim/shared-ui` package contains reusable components that all module apps use:

### Components

1. **AppShell** - Main layout wrapper with sidebar and navbar
2. **Sidebar** - Collapsible sidebar with menu items
   - SidebarHeader
   - SidebarSearch
   - SidebarMenu
   - SidebarMenuItem
   - SidebarFooter
3. **Navbar** - Top navigation bar with breadcrumbs, search, and actions

### Usage Example

```tsx
import { AppShell } from "@kwim/shared-ui";
import { moduleConfig } from "@/config/module.config";

export default function Page() {
  return (
    <AppShell
      menus={moduleConfig.menu}
      quickActions={moduleConfig.quickActions}
      currentPath="/transport/dashboard"
    >
      <YourPageContent />
    </AppShell>
  );
}
```

## Module Configuration

Each module app has a `module.config.ts` file that defines:

- **Module metadata** (name, display name, icon)
- **Quick actions** - Module-specific actions in the navbar
- **Menu items** - Sidebar navigation structure
- **Routes** - Application routes
- **Permissions** - Required permissions

### Example: Transport Module Config

```typescript
export const transportModuleConfig: ModuleConfig = {
  name: "transport",
  displayName: "Transport Management",
  icon: Truck,
  baseUrl: "/transport",
  
  quickActions: [
    {
      icon: Truck,
      label: "New Trip",
      href: "/transport/trips/new",
    },
    // ... more actions
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Truck,
      path: "/transport",
    },
    // ... more menu items
  ],
};
```

## Creating a New Module App

### 1. Create the app structure

```bash
mkdir -p apps/[module-name]/src/{app,config,components}
```

### 2. Copy configuration files

Copy from `apps/transport/`:
- `package.json` (update name and port)
- `next.config.js` (update basePath)
- `tsconfig.json`
- `tailwind.config.js`

### 3. Create module configuration

Create `src/config/module.config.ts` with your module's:
- Quick actions
- Menu items
- Routes
- Permissions

### 4. Create pages

Create pages in `src/app/` using the AppShell:

```tsx
"use client";

import { AppShell } from "@kwim/shared-ui";
import { moduleConfig } from "@/config/module.config";

export default function ModulePage() {
  return (
    <AppShell
      menus={moduleConfig.menu}
      quickActions={moduleConfig.quickActions}
    >
      {/* Your content */}
    </AppShell>
  );
}
```

### 5. Update workspace

Add to `pnpm-workspace.yaml` if not already included:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 6. Install dependencies

```bash
pnpm install
```

### 7. Run the app

```bash
pnpm --filter @kwim/[module-name] dev
```

## Development Workflow

### Run all apps

```bash
pnpm dev:all
```

### Run specific app

```bash
pnpm --filter @kwim/transport dev
```

### Build all apps

```bash
pnpm build
```

### Build specific app

```bash
pnpm --filter @kwim/transport build
```

## URL Structure

Each module runs on its own port and has its own base path:

- Transport: `http://localhost:3001/transport`
- HR: `http://localhost:3002/hr`
- Products: `http://localhost:3003/products`
- Finance: `http://localhost:3004/finance`
- CRM: `http://localhost:3005/crm`

In production, these would be served through a reverse proxy or API gateway.

## Benefits

1. **Independent Deployment** - Each module can be deployed separately
2. **Team Autonomy** - Different teams can work on different modules
3. **Scalability** - Scale individual modules based on demand
4. **Technology Flexibility** - Each module can use different versions or tools
5. **Code Reusability** - Shared components reduce duplication
6. **Faster Builds** - Only build what changed
7. **Better Performance** - Smaller bundle sizes per module

## Migration Path

### Phase 1: Setup (Current)
- ✅ Create shared-ui package
- ✅ Move sidebar components to shared-ui
- ✅ Create transport module as template
- ⏳ Move navbar components to shared-ui

### Phase 2: Module Creation
- Create HR module app
- Create Products module app
- Create Finance module app
- Create CRM module app
- Create remaining module apps

### Phase 3: Migration
- Migrate existing pages from admin app to module apps
- Update routing and navigation
- Test authentication and permissions

### Phase 4: Cleanup
- Remove migrated code from admin app
- Update documentation
- Deploy module apps

## Best Practices

1. **Use shared-ui components** - Don't recreate sidebar/navbar
2. **Define module config** - Centralize module metadata
3. **Follow naming conventions** - Use consistent naming across modules
4. **Keep modules independent** - Avoid cross-module dependencies
5. **Use workspace dependencies** - Reference shared packages via workspace protocol
6. **Test in isolation** - Each module should work standalone
7. **Document module-specific features** - Add README to each module

## Troubleshooting

### Module not found errors
```bash
pnpm install
```

### Port already in use
Update port in `package.json` dev script

### Shared component not updating
```bash
pnpm --filter @kwim/shared-ui build
```

### TypeScript errors
```bash
pnpm type-check
```
