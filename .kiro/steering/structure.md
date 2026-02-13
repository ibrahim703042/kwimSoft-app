# Project Structure

## Architecture Pattern

This project follows an **Odoo-inspired modular architecture** where each business domain is encapsulated as a self-contained module with its own routes, menus, and permissions.

## Directory Organization

```
src/
├── app/                    # Application core & orchestration
│   ├── AppShell.tsx       # Main app shell/layout wrapper
│   ├── Router.tsx         # Central routing configuration
│   ├── ModuleRegistry.ts  # Module registration system
│   └── registerModules.ts # Module registration & exports
│
├── core/                   # Core cross-cutting concerns
│   └── auth/              # Authentication & authorization
│       ├── auth.store.ts  # Auth state management
│       ├── useAuth.ts     # Auth hook
│       ├── PermissionGuard.tsx  # Permission checking
│       ├── ProtectedRoute.tsx   # Route protection
│       └── login/         # Auth pages (Login, ForgotPassword, etc.)
│
├── modules/               # Business domain modules (Odoo-style)
│   ├── dashboard/         # Dashboard module
│   ├── transport/         # Transport management
│   ├── carwash/          # Carwash operations
│   ├── maintenance/      # Fleet maintenance
│   ├── hr/               # HR & people management
│   ├── inventory/        # Inventory & warehouse
│   ├── crm/              # Customer relationship management
│   ├── finance/          # Finance & accounting
│   ├── procurement/      # Procurement
│   ├── manufacturing/    # Manufacturing
│   ├── sales/            # Sales operations
│   ├── product/          # Product management
│   ├── report/           # Reports & analytics
│   ├── user/             # Legacy user module (routes only)
│   └── account/          # User profile & settings
│
├── components/            # Reusable UI components
│   ├── app/              # App-level components
│   │   ├── back-office/  # Back-office specific components
│   │   └── web/          # Web/public facing components
│   ├── layout/           # Layout components
│   ├── navbar/           # Navigation bar components
│   ├── sidebar/          # Sidebar components
│   └── others/           # Utility components
│       ├── app/          # App utilities (NotFound, ComingSoon, etc.)
│       ├── carddataTable/  # Data table cards
│       ├── cartoTrip/    # Map/trip visualization
│       ├── fetchData/    # Data fetching utilities
│       ├── highcharts/   # Chart components
│       ├── MapStyle/     # Map styling
│       └── updatecomponent/  # Update utilities
│
├── pages/                 # Page-level components
│   └── landing/          # Public landing pages
│       ├── LandingPage.tsx
│       ├── TrialPage.tsx
│       ├── Register.tsx
│       ├── ThankYouPage.tsx
│       ├── CreateEnterprise.tsx
│       ├── InviteUsersPage.tsx
│       └── WelcomePage.tsx
│
├── store/                 # Global state management
│   └── selectors/        # State selectors
│       └── themeStore.ts # Theme state
│
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── config/                # Configuration files
├── assets/                # Static assets
│   ├── font/             # Custom fonts (Roboto)
│   └── img/              # Images organized by domain
│       ├── auth/         # Auth page images
│       ├── img/          # General images
│       ├── imgCarte/     # Map type images
│       ├── lang/         # Language flags
│       ├── users/        # User avatars
│       └── utils/        # Utility images
│
└── styles/                # Global styles
```

## Module Structure

Each module in `src/modules/` follows this pattern:

```
module-name/
├── index.ts              # Module definition & export
├── routes.ts             # Route definitions
├── menu.ts               # Menu/navigation items
├── pages/                # Module-specific pages
├── components/           # Module-specific components
└── hooks/                # Module-specific hooks
```

### Module Definition Example

```typescript
// src/modules/example/index.ts
import { FrontModule } from "@/app/ModuleRegistry";
import { routes } from "./routes";
import { menu } from "./menu";

export const exampleModule: FrontModule = {
  name: "example",
  routes,
  menu,
  permissions: ["example.view", "example.edit"],
};
```

## Key Architectural Concepts

### 1. Module Registry System
- Modules self-register via `ModuleRegistry`
- Each module declares routes, menus, and permissions
- Central registration in `src/app/registerModules.ts`
- Module order determines sidebar menu order

### 2. Route Protection
- `ProtectedRoute` wrapper for authenticated routes
- `Can` component for permission-based rendering
- Permission strings follow pattern: `module.action` (e.g., `transport.view`)

### 3. Lazy Loading
- Public pages lazy-loaded via `React.lazy()`
- Suspense boundaries with loading fallbacks
- Improves initial bundle size

### 4. Path Aliases
- Use `@/` prefix for all imports from `src/`
- Specific aliases for major directories (`@/modules/*`, `@/components/*`, etc.)
- Configured in `tsconfig.json` and `vite.config.js`

## Naming Conventions

- **Files**: PascalCase for components (`UserProfile.tsx`), camelCase for utilities (`fetchData.ts`)
- **Modules**: kebab-case directory names (`fleet-maintenance/`)
- **Components**: PascalCase exports
- **Hooks**: camelCase with `use` prefix (`useAuth`, `usePermissions`)
- **Stores**: camelCase with `.store.ts` suffix (`auth.store.ts`)

## Configuration Files

- `vite.config.js` - Vite build configuration
- `tsconfig.json` - TypeScript configuration with path aliases
- `tailwind.config.js` - Tailwind CSS theme customization
- `components.json` - shadcn/ui component configuration
- `config.tsx` - Legacy config re-exports (backward compatibility)
- `src/config/` - New centralized config system

## Public Assets

- `public/` - Static assets served as-is
- `src/assets/` - Assets processed by Vite (fonts, images)
- Images organized by domain/feature for better maintainability
