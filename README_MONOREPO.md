# KWIM ERP - Modular Monorepo

A multi-tenant ERP platform with independent module applications. Each business domain (Transport, HR, Finance, CRM, etc.) is its own Next.js application with shared UI components.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run admin app (legacy)
pnpm dev:admin

# Run a specific module
pnpm dev:transport
pnpm dev:hr
pnpm dev:finance

# Run all apps (requires multiple terminals)
pnpm dev:all
```

## 📦 Module Applications

| Module | Port | URL | Command |
|--------|------|-----|---------|
| Admin (Legacy) | 3000 | http://localhost:3000 | `pnpm dev:admin` |
| Transport | 3001 | http://localhost:3001/transport | `pnpm dev:transport` |
| HR | 3002 | http://localhost:3002/hr | `pnpm dev:hr` |
| Finance | 3003 | http://localhost:3003/finance | `pnpm dev:finance` |
| CRM | 3004 | http://localhost:3004/crm | `pnpm dev:crm` |
| Product | 3005 | http://localhost:3005/product | `pnpm dev:product` |
| Sales | 3006 | http://localhost:3006/sales | `pnpm dev:sales` |
| Procurement | 3007 | http://localhost:3007/procurement | `pnpm dev:procurement` |
| Manufacturing | 3008 | http://localhost:3008/manufacturing | `pnpm dev:manufacturing` |
| Inventory | 3009 | http://localhost:3009/inventory | `pnpm dev:inventory` |
| Maintenance | 3010 | http://localhost:3010/maintenance | `pnpm dev:maintenance` |
| Carwash | 3011 | http://localhost:3011/carwash | `pnpm dev:carwash` |

## 🏗️ Architecture

```
kwim-monorepo/
├── apps/                    # Module applications
│   ├── admin/              # Legacy Vite/React app
│   ├── transport/          # Transport module (Next.js)
│   ├── hr/                 # HR module (Next.js)
│   ├── finance/            # Finance module (Next.js)
│   └── ...                 # Other modules
├── packages/               # Shared packages
│   ├── shared-ui/         # Shared UI components
│   ├── auth/              # Authentication
│   ├── config/            # Configuration
│   └── ...                # Other shared packages
├── scripts/               # Utility scripts
│   └── create-module-app.js
└── docs/                  # Documentation
    ├── MONOREPO_ARCHITECTURE.md
    ├── MODULE_APPS.md
    ├── CREATE_MODULE_APP.md
    └── TRANSFORMATION_SUMMARY.md
```

## 🎨 Features

### Module-Specific Quick Actions

Each module has its own quick actions in the navbar dropdown:

- **Transport**: New Trip, Add Driver, Add Station, View Schedule
- **HR**: New Employee, Record Attendance, Process Payroll
- **Finance**: Create Invoice, Record Payment, New Budget
- **CRM**: New Lead, Add Customer, Create Opportunity
- And more...

### Shared Components

All modules use shared components from `@kwim/shared-ui`:

- **AppShell** - Main layout wrapper
- **Sidebar** - Collapsible navigation
- **Navbar** - Top navigation bar
- **SidebarHeader** - Logo and toggle
- **SidebarMenu** - Menu items
- **SidebarFooter** - User profile

### Independent Development

- Each module can be developed independently
- No merge conflicts between modules
- Faster build times (only build what changed)
- Independent deployment

## 🛠️ Creating a New Module

Use the provided script:

```bash
node scripts/create-module-app.js <module-name> <port> [icon]
```

Example:

```bash
node scripts/create-module-app.js accounting 3012 Calculator
```

This creates a complete Next.js app with:
- Module configuration
- Dashboard page
- Sidebar navigation
- Quick actions
- Tailwind CSS setup
- TypeScript configuration

See [CREATE_MODULE_APP.md](docs/CREATE_MODULE_APP.md) for detailed instructions.

## 📚 Documentation

- [Monorepo Architecture](docs/MONOREPO_ARCHITECTURE.md) - Complete architecture guide
- [Module Apps](docs/MODULE_APPS.md) - List of all module apps
- [Create Module App](docs/CREATE_MODULE_APP.md) - Guide for creating new modules
- [Transformation Summary](docs/TRANSFORMATION_SUMMARY.md) - What was done

## 🔧 Development

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
# Run specific module
pnpm dev:transport

# Run admin app
pnpm dev:admin

# Run all apps in parallel
pnpm dev:all
```

### Build

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build:transport
```

### Type Check

```bash
# Check all apps
pnpm type-check

# Check specific app
pnpm --filter @kwim/transport type-check
```

### Lint

```bash
# Lint all apps
pnpm lint

# Lint specific app
pnpm --filter @kwim/transport lint
```

## 🚢 Production Deployment

### Option 1: Reverse Proxy

Use Nginx or API Gateway to route requests to appropriate modules.

### Option 2: Subdomain Routing

Each module on its own subdomain:
- transport.kwim.com
- hr.kwim.com
- finance.kwim.com

### Option 3: Containerized

Each module in its own Docker container.

### Option 4: Serverless

Deploy each module as serverless functions (Vercel, AWS Lambda, etc.).

## 🎯 Benefits

1. **Independent Development** - Teams can work on different modules
2. **Faster Builds** - Only build what changed
3. **Better Performance** - Smaller bundle sizes per module
4. **Easier Scaling** - Scale modules independently
5. **Technology Flexibility** - Use different tools per module
6. **Code Reusability** - Shared components reduce duplication

## 📝 Tech Stack

- **Framework**: Next.js 14 (module apps), Vite (admin app)
- **Language**: TypeScript
- **UI**: React 18, Tailwind CSS, Radix UI
- **Icons**: Lucide React
- **State**: Zustand
- **Package Manager**: pnpm
- **Monorepo**: pnpm workspaces

## 🤝 Contributing

1. Create a new module using the script
2. Develop your features
3. Test in isolation
4. Submit PR

## 📄 License

Proprietary - KWIM Software

## 🆘 Support

For issues or questions:
1. Check the [documentation](docs/)
2. Review existing module apps for examples
3. Contact the development team

---

**Note**: This is a modular monorepo architecture. Each module is an independent application that can be developed, tested, and deployed separately while sharing common UI components for consistency.
