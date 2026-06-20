# Technology Stack

## Build System & Package Management

- **Monorepo**: pnpm workspaces
- **Package Manager**: pnpm (required)
- **Build Tool**: Vite 5.x
- **Module Type**: ESM (ES Modules)
- **TypeScript**: 5.7.x

## Core Technologies

### Frontend Framework
- **React**: 18.3.x
- **TypeScript**: Full type coverage required
- **Routing**: React Router v6

### State Management
- **Server State**: TanStack Query (React Query) v5
- **Client State**: Zustand v5
- **Legacy**: Redux Toolkit v2 (being phased out)

### Styling
- **CSS Framework**: Tailwind CSS v3
- **Animation**: tailwindcss-animate
- **Utilities**: clsx, tailwind-merge, class-variance-authority
- **Component Motion**: Framer Motion v11

### UI Components
- **Base Components**: Radix UI (headless components)
- **Custom Library**: shadcn/ui pattern
- **Icons**: Lucide React, React Bootstrap Icons, MUI Icons
- **Data Tables**: TanStack Table v8
- **Charts**: Recharts, Highcharts

### Forms & Validation
- **Form Management**: React Hook Form v7
- **Validation**: Zod v3, Yup v1
- **Resolvers**: @hookform/resolvers

### API Integration
- **HTTP Client**: Axios v1
- **Code Generation**: Orval v7 (OpenAPI → TypeScript)
- **Authentication**: JWT with jwt-decode

### Specialized Libraries
- **Maps**: Mapbox GL, React Map GL, Google Maps API
- **Dates**: date-fns v3
- **Internationalization**: i18next v24, react-i18next
- **Alerts**: SweetAlert2
- **Loading States**: react-spinners

## Common Commands

### Development
```bash
# Install dependencies
pnpm install

# Run admin app (default)
pnpm dev
pnpm dev:admin

# Run specific module app
pnpm dev:transport
pnpm dev:hr
pnpm dev:finance

# Run all apps concurrently
pnpm dev:all

# Run selected apps
pnpm dev:concurrent admin transport hr
```

### Building
```bash
# Build all apps
pnpm build

# Build specific app
pnpm build:admin
pnpm build:web
pnpm build:transport
```

### Code Quality
```bash
# Type check all packages
pnpm type-check

# Lint all packages
pnpm lint

# Clean all build artifacts
pnpm clean
```

### API Code Generation
```bash
# Generate API clients from OpenAPI specs
pnpm api:generate

# Generate specific service client
pnpm api:generate:user
pnpm api:generate:hr
pnpm api:generate:product
pnpm api:generate:inventory
pnpm api:generate:transport
pnpm api:generate:gateway

# Watch mode for API generation
pnpm api:generate:watch
```

### Creating New Modules
```bash
# Create a new module app
node scripts/create-vite-module-app.js <name> <port> [icon]

# Example
node scripts/create-vite-module-app.js accounting 3012 Calculator
```

## Development Ports

Each module runs on a dedicated port:

| Module | Port |
|--------|------|
| Admin | 3000 |
| Transport | 3001 |
| HR | 3002 |
| Finance | 3003 |
| CRM | 3004 |
| Product | 3005 |
| Sales | 3006 |
| Procurement | 3007 |
| Manufacturing | 3008 |
| Inventory | 3009 |
| Maintenance | 3010 |
| Carwash | 3011 |

## Path Aliases

TypeScript path aliases are configured for cleaner imports:

- `@/core/*` - Core systems (auth, crud, api, ui)
- `@/modules/*` - Feature modules
- `@/components/*` - Shared components
- `@/lib/*` - Utility functions
- `@/hooks/*` - Shared hooks
- `@/config/*` - Configuration
- `@kwim/*` - Workspace packages

## Vite Features

- **Instant HMR** - Hot Module Replacement for fast development
- **Native ESM** - No bundling during development
- **Optimized Builds** - Production builds with code splitting
- **Plugin Ecosystem**: vite-plugin-svgr, vite-tsconfig-paths

## Environment Configuration

- `.env` - Local environment variables (gitignored)
- `.env.example` - Template for required variables
- API endpoints, tenant IDs, and feature flags configured via env vars
