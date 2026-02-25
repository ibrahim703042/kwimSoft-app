# ✅ Vite/React Monorepo Setup Complete!

All module apps are now using **Vite + React + React Router** instead of Next.js!

## What's Working

✅ **Admin App (Vite/React)** - Running on port 3000
✅ **11 Module Apps (Vite/React)** - Ready on ports 3001-3011
✅ **Shared UI Package** - Sidebar, Navbar, AppShell components
✅ **Module-Specific Quick Actions** - Each module has its own actions
✅ **Independent Sidebar Navigation** - Each module defines its own menu
✅ **Concurrent Running** - Run multiple apps at once
✅ **All using Vite** - Fast HMR and builds

## Quick Start

### Run Individual Apps

```bash
# Run admin app
pnpm dev:admin

# Run transport module
pnpm dev:transport

# Run HR module
pnpm dev:hr

# Run finance module
pnpm dev:finance
```

### Run Multiple Apps Concurrently

```bash
# Run all apps
pnpm dev:all

# Run specific apps
pnpm dev:concurrent admin transport hr finance

# Or use the script directly
node scripts/run-concurrent.js admin transport hr
```

## Available Modules (All Vite/React)

| Module | Port | Command | URL |
|--------|------|---------|-----|
| Admin | 3000 | `pnpm dev:admin` | http://localhost:3000 |
| Transport | 3001 | `pnpm dev:transport` | http://localhost:3001 |
| HR | 3002 | `pnpm dev:hr` | http://localhost:3002 |
| Finance | 3003 | `pnpm dev:finance` | http://localhost:3003 |
| CRM | 3004 | `pnpm dev:crm` | http://localhost:3004 |
| Product | 3005 | `pnpm dev:product` | http://localhost:3005 |
| Sales | 3006 | `pnpm dev:sales` | http://localhost:3006 |
| Procurement | 3007 | `pnpm dev:procurement` | http://localhost:3007 |
| Manufacturing | 3008 | `pnpm dev:manufacturing` | http://localhost:3008 |
| Inventory | 3009 | `pnpm dev:inventory` | http://localhost:3009 |
| Maintenance | 3010 | `pnpm dev:maintenance` | http://localhost:3010 |
| Carwash | 3011 | `pnpm dev:carwash` | http://localhost:3011 |

## Architecture

```
kwim-monorepo/
├── apps/
│   ├── admin/          ✅ Vite/React (uses shared-ui)
│   ├── transport/      ✅ Vite/React
│   ├── hr/             ✅ Vite/React
│   ├── finance/        ✅ Vite/React
│   ├── crm/            ✅ Vite/React
│   ├── product/        ✅ Vite/React
│   ├── sales/          ✅ Vite/React
│   ├── procurement/    ✅ Vite/React
│   ├── manufacturing/  ✅ Vite/React
│   ├── inventory/      ✅ Vite/React
│   ├── maintenance/    ✅ Vite/React
│   └── carwash/        ✅ Vite/React
└── packages/
    └── shared-ui/      ✅ Reusable components
```

## Each Module App Has

- **Vite** for fast dev server and HMR
- **React 18** with TypeScript
- **React Router v6** for routing
- **Tailwind CSS** for styling
- **Shared UI components** (Sidebar, Navbar, AppShell)
- **Module-specific configuration** (quick actions, menu)
- **Independent port** for isolated development

## Module Structure

```
apps/[module]/
├── src/
│   ├── pages/
│   │   └── Dashboard.tsx      # Main dashboard
│   ├── config/
│   │   └── module.config.ts   # Module configuration
│   ├── components/            # Module-specific components
│   ├── App.tsx                # Main app component
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
├── index.html                 # HTML template
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind configuration
└── package.json               # Dependencies
```

## Key Features

### 1. Fast Development with Vite

- ⚡ Instant server start
- ⚡ Lightning-fast HMR
- ⚡ Optimized builds
- ⚡ Native ESM support

### 2. Module-Specific Quick Actions

Each module has its own quick actions:

```typescript
// apps/transport/src/config/module.config.ts
quickActions: [
  {
    icon: Truck,
    label: "New Trip",
    description: "Schedule a new trip",
    onClick: () => console.log("New Trip"),
  },
  // ... more actions
],
```

### 3. Independent Sidebar Navigation

Each module defines its own menu:

```typescript
menu: [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Truck,
    path: "/",
  },
  // ... more menu items
],
```

### 4. Shared Components

All modules use the same AppShell:

```typescript
import { AppShell } from "@kwim/shared-ui";
import { NavLink } from "react-router-dom";

<AppShell
  menus={moduleConfig.menu}
  quickActions={moduleConfig.quickActions}
  LinkComponent={NavLink}
>
  {/* Your content */}
</AppShell>
```

## Creating New Modules

Use the Vite script:

```bash
node scripts/create-vite-module-app.js <name> <port> [icon]
```

Example:

```bash
node scripts/create-vite-module-app.js accounting 3012 Calculator
```

This creates a complete Vite/React app with:
- Vite configuration
- React Router setup
- Module configuration
- Dashboard page
- Sidebar navigation
- Quick actions
- Tailwind CSS
- TypeScript

## Running Apps Concurrently

### Run All Apps

```bash
pnpm dev:all
```

This starts all 12 apps (admin + 11 modules) concurrently.

### Run Specific Apps

```bash
# Run admin, transport, and HR
node scripts/run-concurrent.js admin transport hr

# Or use the npm script
pnpm dev:concurrent admin transport hr finance
```

### Stop All Apps

Press `Ctrl+C` in the terminal to stop all running apps.

## Development Workflow

### 1. Start Your Module

```bash
pnpm dev:transport
```

### 2. Make Changes

Edit files in `apps/transport/src/` and see instant HMR updates.

### 3. Add New Pages

Create new pages in `apps/transport/src/pages/`:

```typescript
// apps/transport/src/pages/Trips.tsx
export default function Trips() {
  return <div>Trips List</div>;
}
```

Add route in `App.tsx`:

```typescript
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/trips" element={<Trips />} />
</Routes>
```

### 4. Update Module Config

Edit `apps/transport/src/config/module.config.ts` to add:
- New menu items
- Quick actions
- Permissions

## Benefits of Vite

1. **Fast Startup** - Server starts in milliseconds
2. **Instant HMR** - Changes reflect immediately
3. **Optimized Builds** - Smaller bundle sizes
4. **Native ESM** - No bundling in dev mode
5. **Better DX** - Faster feedback loop
6. **TypeScript Support** - Built-in TS support
7. **Plugin Ecosystem** - Rich plugin ecosystem

## Configuration

### Vite Config

Each module has its own `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@kwim/shared-ui": path.resolve(__dirname, "../../packages/shared-ui/src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3001,
  },
});
```

### TypeScript Config

Path aliases configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@kwim/shared-ui": ["../../packages/shared-ui/src/index.ts"]
    }
  }
}
```

### Tailwind Config

Includes shared-ui content:

```javascript
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/shared-ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};
```

## Troubleshooting

### Port Already in Use

Change the port in `vite.config.ts`:

```typescript
server: {
  port: 3012, // Use different port
},
```

### Module Not Found

```bash
pnpm install
```

### Shared UI Not Updating

Restart the dev server:

```bash
# Stop with Ctrl+C
pnpm dev:transport
```

### TypeScript Errors

```bash
pnpm type-check
```

## Next Steps

1. **Customize Modules** - Add more pages and features
2. **Add Authentication** - Integrate auth from @kwim/auth
3. **Connect APIs** - Wire up backend API calls
4. **Add Tests** - Write unit and integration tests
5. **Deploy** - Set up CI/CD pipeline

## Scripts Reference

```bash
# Development
pnpm dev                    # Run admin app
pnpm dev:admin              # Run admin app
pnpm dev:transport          # Run transport module
pnpm dev:hr                 # Run HR module
pnpm dev:all                # Run all apps concurrently
pnpm dev:concurrent [apps]  # Run specific apps

# Build
pnpm build                  # Build all apps
pnpm build:admin            # Build admin app
pnpm build:transport        # Build transport module

# Quality
pnpm lint                   # Lint all apps
pnpm type-check             # Type check all apps

# Utilities
node scripts/create-vite-module-app.js <name> <port> [icon]
node scripts/run-concurrent.js [app1] [app2] ...
```

## Success! 🎉

You now have a fully functional Vite/React monorepo with:

- ✅ 12 independent Vite/React applications
- ✅ Shared UI components
- ✅ Module-specific quick actions
- ✅ Independent sidebar navigation
- ✅ Concurrent running capability
- ✅ Fast development with Vite
- ✅ Complete TypeScript support

All apps use Vite for blazing-fast development! 🚀
