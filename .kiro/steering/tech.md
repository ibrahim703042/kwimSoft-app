# Technology Stack

## Core Framework

- **React 18** with TypeScript
- **Vite** for build tooling and dev server
- **React Router v6** for routing

## State Management

- **Zustand** for lightweight state (auth, tenant, theme, sidebar)
- **Redux Toolkit** for legacy global state
- **TanStack Query (React Query)** for server state and data fetching

## UI & Styling

- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible headless components
- **shadcn/ui** component patterns
- **Material-UI (MUI)** for some legacy components
- **Lucide React** for icons
- **SweetAlert2** for alerts, notifications, and confirmation dialogs

## Forms & Validation

- **React Hook Form** for form state management
- **Zod** for schema validation
- **Yup** for legacy validation

## Data & API

- **Axios** for HTTP requests with service-specific instances
- Multi-service architecture (userManagement, transport, product, hr, stock)
- Automatic token refresh on 401 responses
- Bearer token authentication

## Maps & Visualization

- **react-map-gl** for declarative Mapbox integration (preferred)
- **Mapbox GL** for imperative map API (legacy)
- **Highcharts** and **Recharts** for charts
- **TanStack Table** for data tables

**Map Implementation:**
- Use `react-map-gl` components (`Map`, `Marker`, `Source`, `Layer`) for new map features
- Declarative React approach for better component integration
- GeoJSON support for routes and polygons
- Access token: Stored as constant in map components

## Internationalization

- **i18next** with react-i18next for translations
- Language files in `src/locales/` (en.json, fr.json)

## Common Commands

```bash
# Development server (runs on port 3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Path Aliases

The project uses TypeScript path aliases configured in `tsconfig.json`:
- `@/*` → `src/*`
- `@/app/*` → `src/app/*`
- `@/core/*` → `src/core/*`
- `@/modules/*` → `src/modules/*`
- `@/components/*` → `src/components/*`
- `@/hooks/*` → `src/hooks/*`
- `@/lib/*` → `src/lib/*`
- `@/config` → `src/config/index.ts`

Always use these aliases instead of relative imports.
