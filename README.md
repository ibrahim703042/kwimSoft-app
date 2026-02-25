# KWIM ERP - Vite/React Monorepo

A multi-tenant ERP platform with independent Vite/React module applications. Each business domain is its own app with shared UI components.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run admin app
pnpm dev:admin

# Run a module app
pnpm dev:transport
pnpm dev:hr
pnpm dev:finance

# Run all apps concurrently
pnpm dev:all

# Run specific apps concurrently
pnpm dev:concurrent admin transport hr
```

## 📦 Module Applications (All Vite/React)

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

## 🏗️ Architecture

```
kwim-monorepo/
├── apps/                    # Module applications (all Vite/React)
│   ├── admin/              # Main admin app
│   ├── transport/          # Transport module
│   ├── hr/                 # HR module
│   ├── finance/            # Finance module
│   └── ...                 # Other modules
├── packages/               # Shared packages
│   ├── shared-ui/         # Shared UI components
│   ├── auth/              # Authentication
│   ├── config/            # Configuration
│   └── ...                # Other shared packages
└── scripts/               # Utility scripts
    ├── create-vite-module-app.js
    └── run-concurrent.js
```

## ⚡ Features

### Fast Development with Vite
- Instant server start
- Lightning-fast HMR
- Optimized builds
- Native ESM support

### Module-Specific Quick Actions
Each module has its own quick actions in the navbar dropdown.

### Independent Sidebar Navigation
Each module defines its own menu structure.

### Shared Components
All modules use the same AppShell, Sidebar, and Navbar from `@kwim/shared-ui`.

### Concurrent Running
Run multiple apps at once with `pnpm dev:all` or choose specific apps.

## 🛠️ Creating a New Module

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

## 🔄 Running Apps Concurrently

### Run All Apps

```bash
pnpm dev:all
```

### Run Specific Apps

```bash
# Using the script
node scripts/run-concurrent.js admin transport hr

# Using npm script
pnpm dev:concurrent admin transport hr finance
```

### Stop All Apps

Press `Ctrl+C` to stop all running apps.

## 📚 Documentation

- [VITE_SETUP_COMPLETE.md](VITE_SETUP_COMPLETE.md) - Complete setup guide
- [docs/MONOREPO_ARCHITECTURE.md](docs/MONOREPO_ARCHITECTURE.md) - Architecture details
- [docs/MODULE_APPS.md](docs/MODULE_APPS.md) - Module list
- [docs/CREATE_MODULE_APP.md](docs/CREATE_MODULE_APP.md) - Create new modules
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - Common issues

## 🎯 Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: Zustand
- **Package Manager**: pnpm
- **Monorepo**: pnpm workspaces

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev:transport

# Build
pnpm build

# Type check
pnpm type-check

# Lint
pnpm lint
```

## 📝 Module Structure

```
apps/[module]/
├── src/
│   ├── pages/
│   │   └── Dashboard.tsx
│   ├── config/
│   │   └── module.config.ts
│   ├── components/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

## 🎨 Module Configuration

Each module has a `module.config.ts` file:

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
      description: "Schedule a new trip",
      onClick: () => console.log("New Trip"),
    },
  ],

  menu: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Truck,
      path: "/",
    },
  ],
};
```

## 🚢 Benefits

1. **Independent Development** - Teams work on different modules
2. **Fast Builds** - Only build what changed
3. **Better Performance** - Smaller bundle sizes
4. **Easier Scaling** - Scale modules independently
5. **Technology Flexibility** - Use different tools per module
6. **Code Reusability** - Shared components reduce duplication
7. **Blazing Fast HMR** - Vite's instant hot module replacement

## 🤝 Contributing

1. Create a new module using the script
2. Develop your features
3. Test in isolation
4. Submit PR

## 📄 License

Proprietary - KWIM Software

---

**All apps use Vite for blazing-fast development!** ⚡🚀
