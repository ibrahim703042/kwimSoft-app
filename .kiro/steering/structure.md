# Project Structure

## Monorepo Organization

KWIM uses a pnpm workspace monorepo with two main directories:

```
kwim-app/
├── apps/              # Independent module applications
├── packages/          # Shared libraries and components
├── scripts/           # Build and utility scripts
└── .kiro/            # Kiro AI configuration and steering
```

## Apps Directory

Each app is a standalone Vite + React application for a specific business domain:

```
apps/
├── admin/            # Main admin dashboard (port 3000)
├── transport/        # Transport module (port 3001)
├── hr/              # HR module (port 3002)
├── finance/         # Finance module (port 3003)
├── crm/             # CRM module (port 3004)
├── product/         # Product module (port 3005)
├── sales/           # Sales module (port 3006)
├── procurement/     # Procurement module (port 3007)
├── manufacturing/   # Manufacturing module (port 3008)
├── inventory/       # Inventory module (port 3009)
├── maintenance/     # Maintenance module (port 3010)
└── carwash/         # Carwash module (port 3011)
```

### Module App Structure (Odoo-inspired)

Each app follows this internal organization:

```
apps/[module]/
├── src/
│   ├── app/                      # Application orchestration
│   │   ├── AppShell.tsx         # Main layout (sidebar + navbar)
│   │   ├── ModuleRegistry.ts    # Module type definitions
│   │   ├── registerModules.ts   # Module registration
│   │   └── Router.tsx           # Dynamic routing
│   │
│   ├── core/                     # Core systems (reusable)
│   │   ├── auth/                # Authentication & RBAC
│   │   │   ├── auth.store.ts   # Zustand auth store
│   │   │   ├── useAuth.ts      # Auth hook
│   │   │   └── PermissionGuard.tsx  # <Can> component
│   │   ├── tenant/              # Multi-tenant context
│   │   │   ├── tenant.store.ts
│   │   │   └── TenantSwitcher.tsx
│   │   ├── api/                 # API client wrapper
│   │   │   └── client.ts       # Axios with tenant headers
│   │   ├── crud/                # Generic CRUD system
│   │   │   ├── CrudPage.tsx    # Complete CRUD page
│   │   │   ├── CrudTable.tsx   # Generic table
│   │   │   ├── CrudForm.tsx    # Generic form
│   │   │   └── ActionBar.tsx   # Workflow actions
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Page.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── PageToolbar.tsx
│   │   │   └── PageContent.tsx
│   │   └── hooks/               # Utility hooks
│   │
│   ├── modules/                  # Feature modules
│   │   └── [feature]/           # Self-contained feature
│   │       ├── index.ts         # Module export (FrontModule)
│   │       ├── routes.tsx       # Route definitions
│   │       ├── menu.ts          # Menu items
│   │       ├── pages/           # Page components
│   │       ├── components/      # Feature-specific components
│   │       ├── api/             # API calls for this feature
│   │       └── schemas/         # Zod validation schemas
│   │
│   ├── components/               # Shared UI components (shadcn/ui)
│   │   └── ui/                  # Base UI components
│   │
│   ├── hooks/                    # Shared custom hooks
│   ├── lib/                      # Utility functions
│   │   ├── axios.ts             # Axios instance
│   │   └── utils.ts             # Helper functions (cn, etc.)
│   │
│   ├── locales/                  # Internationalization
│   │   ├── en.json
│   │   ├── fr.json
│   │   └── i18n.ts
│   │
│   ├── config/                   # Configuration
│   │   └── index.ts
│   │
│   ├── assets/                   # Static assets
│   │   ├── font/
│   │   └── img/
│   │
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
│
├── public/                       # Static files
├── index.html                    # HTML template
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind config
├── postcss.config.js            # PostCSS config
├── eslint.config.js             # ESLint config
└── package.json                 # Package dependencies
```

## Packages Directory

Shared code used across multiple apps:

```
packages/
├── shared-ui/           # Shared UI components
│   ├── src/
│   │   ├── layout/     # AppShell, Sidebar, Navbar
│   │   ├── components/  # Shared components
│   │   ├── stores/     # Shared Zustand stores
│   │   └── types/      # TypeScript types
│   └── package.json
│
├── auth/                # Authentication package
│   └── src/
│       ├── hooks/
│       ├── stores/
│       └── types/
│
├── core/                # Core utilities and systems
│   └── src/
│       ├── crud/
│       ├── ui/
│       └── hooks/
│
├── api-client/          # Generated API clients (Orval)
│   └── src/
│       └── generated/
│
├── config/              # Shared configuration
├── ui/                  # shadcn/ui components
├── utils/               # Shared utilities
└── modules-hr/          # HR-specific shared code
```

## Module System (Odoo-like Architecture)

### FrontModule Pattern

Each feature is a self-contained module that exports a `FrontModule` object:

```typescript
// modules/driver/index.ts
export const driverModule: FrontModule = {
  name: 'driver',
  routes: [...],      // Route definitions
  menu: [...],        // Menu items
  permissions: [...]  // Required permissions
};
```

### Module Registration

Modules are registered centrally in `app/registerModules.ts`:

```typescript
import { driverModule } from '@/modules/driver';
import { userModule } from '@/modules/user';

export const modules: FrontModule[] = [
  driverModule,
  userModule,
  // Add new modules here
];
```

### Dynamic Router

The router is built dynamically from registered modules:

```typescript
// app/Router.tsx
const routes = modules.flatMap(m => m.routes);
```

### Dynamic Sidebar

The sidebar menu is built from registered modules:

```typescript
// Sidebar component
const menuItems = modules.flatMap(m => m.menu);
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `DriverListPage.tsx`, `UserForm.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`, `useFetch.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`, `axios.ts`)
- **Types**: PascalCase (e.g., `types.ts`, `FrontModule.ts`)
- **Stores**: camelCase with `.store.ts` suffix (e.g., `auth.store.ts`, `tenant.store.ts`)
- **API**: camelCase with `.api.ts` suffix (e.g., `driver.api.ts`, `user.api.ts`)
- **Schemas**: camelCase with `.schema.ts` suffix (e.g., `driver.schema.ts`)
- **Config files**: kebab-case (e.g., `vite.config.ts`, `tailwind.config.js`)

## Import Path Guidelines

### Prefer workspace packages for cross-app imports:
```typescript
import { AppShell } from '@kwim/shared-ui';
import { useAuth } from '@kwim/auth';
import { apiClient } from '@kwim/api-client';
```

### Use path aliases for internal imports:
```typescript
import { CrudPage } from '@/core/crud';
import { driverModule } from '@/modules/driver';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

### Avoid relative imports beyond parent directory:
```typescript
// BAD
import { Something } from '../../../core/auth';

// GOOD
import { Something } from '@/core/auth';
```

## Key Architecture Patterns

### 1. Module Independence
- Each module is self-contained with its own routes, menu, and permissions
- Modules can be added/removed without affecting others
- Clear boundaries between features

### 2. Shared Core Systems
- Authentication, CRUD, API client, and UI components are shared
- Reduces duplication across modules
- Consistent patterns and behavior

### 3. Generic CRUD System
- `CrudPage` component handles 70% of list/form boilerplate
- Standardized CRUD operations across all modules
- Configurable via props

### 4. Permission-Based UI
- `<Can>` component wraps protected elements
- Routes check permissions before rendering
- Programmatic permission checks via `useAuth` hook

### 5. Multi-Tenant Context
- Tenant context managed via Zustand store
- Automatic tenant headers injected in API calls
- Tenant switcher in navbar
