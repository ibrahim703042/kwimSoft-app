# kwimSoft-app Architecture

## 🏗️ Odoo-like Modular Back-Office Architecture

This application follows an Odoo-inspired modular architecture where features are self-contained modules that register their routes, menus, and permissions dynamically.

## 📐 Architecture Principles

### 1. **Modular Design**
- Each feature is a self-contained module
- Modules declare their UI (routes, menus, permissions)
- Easy to add, remove, or disable modules
- Clear separation of concerns

### 2. **DRY (Don't Repeat Yourself)**
- Generic CRUD system eliminates boilerplate
- Reusable core components
- Shared utilities and hooks
- Consistent patterns across modules

### 3. **Type Safety**
- Full TypeScript coverage
- Type-safe API calls
- Type-safe forms with Zod
- Type-safe routing

### 4. **Permission-Based Access Control**
- RBAC built into every component
- Route-level permissions
- Action-level permissions
- Easy to manage and audit

### 5. **Multi-Tenant Ready**
- Tenant context management
- Automatic tenant header injection
- Tenant switcher UI
- Isolated data per tenant

## 🗂️ Folder Structure

```
src/
├── app/                          # Application orchestration
│   ├── AppShell.tsx             # Main layout with sidebar/navbar
│   ├── ModuleRegistry.ts        # Module type definitions
│   ├── registerModules.ts       # Central module registration
│   └── Router.tsx               # Dynamic router from modules
│
├── core/                         # Reusable core systems
│   ├── auth/                    # Authentication & RBAC
│   │   ├── auth.store.ts       # Zustand auth store
│   │   ├── useAuth.ts          # Auth hook
│   │   ├── PermissionGuard.tsx # <Can> component
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── tenant/                  # Multi-tenant system
│   │   ├── tenant.store.ts     # Tenant context store
│   │   ├── TenantSwitcher.tsx  # Tenant dropdown
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── api/                     # API client
│   │   ├── client.ts           # Enhanced axios wrapper
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── crud/                    # Generic CRUD system
│   │   ├── CrudPage.tsx        # Complete CRUD page
│   │   ├── CrudTable.tsx       # Generic table
│   │   ├── CrudForm.tsx        # Generic form
│   │   ├── ActionBar.tsx       # Workflow actions
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── ui/                      # Reusable UI components
│   │   ├── Page.tsx            # Page wrapper
│   │   ├── PageHeader.tsx      # Page header
│   │   ├── PageToolbar.tsx     # Toolbar with search
│   │   ├── PageContent.tsx     # Content area
│   │   ├── ConfirmDialog.tsx   # Confirmation dialog
│   │   └── index.ts
│   │
│   └── hooks/                   # Utility hooks
│       ├── useDebounce.ts      # Debounce hook
│       ├── usePagination.ts    # Pagination hook
│       ├── useFilters.ts       # Filters hook
│       ├── useQueryState.ts    # URL query params
│       └── index.ts
│
├── modules/                      # Feature modules
│   ├── dashboard/               # Dashboard module
│   │   ├── index.ts            # Module export
│   │   ├── routes.tsx          # Route definitions
│   │   ├── menu.ts             # Menu items
│   │   └── pages/
│   │       └── DashboardPage.tsx
│   │
│   ├── user/                    # User management module
│   │   ├── index.ts
│   │   ├── routes.tsx
│   │   ├── menu.ts
│   │   └── pages/
│   │       └── UserManagementPage.tsx
│   │
│   └── [other-modules]/         # Future modules
│       ├── index.ts
│       ├── routes.tsx
│       ├── menu.ts
│       ├── pages/
│       ├── components/          # Module-specific components
│       ├── api/                 # API calls
│       └── schemas/             # Zod schemas
│
├── components/                   # Shared components (shadcn/ui + re-exports)
│   ├── ui/                      # shadcn/ui components (re-exported from @kwim/shared-ui)
│   │   ├── index.ts            # Central re-export hub for all UI components
│   │   │                       # - Exports all from @kwim/shared-ui
│   │   │                       # - Re-exports from individual component files for better module resolution
│   │   ├── button.tsx          # Re-exports Button from shared-ui
│   │   ├── input.tsx           # Re-exports Input from shared-ui
│   │   ├── table.tsx           # Re-exports Table components from shared-ui
│   │   └── ...                 # Other UI component re-exports (25+ components)
│   ├── utilitie/                # Utility components
│   │   ├── CardDataTable.tsx   # Data card component with stats display
│   │   ├── ReusableDataTable.tsx # Generic table with TanStack Table
│   │   ├── Loading.tsx         # Re-exported from @kwim/shared-ui
│   │   ├── AlertPopup.tsx      # SweetAlert2 wrappers
│   │   ├── SearchBar.tsx       # Search input component
│   │   └── map/                # Map components
│   │       ├── MapHoraire.tsx  # Route visualization map
│   │       ├── MapDetailStation.tsx # Station detail map
│   │       ├── MapTrip.tsx     # Trip map component
│   │       ├── MapComponent.tsx # Generic map component
│   │       ├── MapComponentDyn.tsx # Dynamic map component
│   │       ├── GeocoderControl.tsx # Geocoder control for maps
│   │       └── ControlPanel.tsx # Map control panel
│   ├── ErrorBanner.tsx          # Error display with retry/dismiss
│   ├── SkeletonCard.tsx         # Loading skeleton component
│   ├── sidebar/                 # Sidebar components (re-exported from shared-ui)
│   ├── navbar/                  # Navbar components (re-exported from shared-ui)
│   └── ...
├── hooks/                        # Shared hooks
├── lib/                          # Utilities
├── locales/                      # i18n translations
├── store/                        # Redux store (legacy)
└── styles/                       # Global styles
```

## 🔄 Data Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│           AppShell                       │
│  ┌────────────┐  ┌──────────────────┐  │
│  │  Sidebar   │  │     Router       │  │
│  │  (Menus)   │  │    (Routes)      │  │
│  └────────────┘  └──────────────────┘  │
└─────────────────────────────────────────┘
       │                    │
       ▼                    ▼
┌─────────────────────────────────────────┐
│         Module Registry                  │
│  ┌──────────┐  ┌──────────┐            │
│  │Dashboard │  │   User   │  ...       │
│  │  Module  │  │  Module  │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         Page Components                  │
│  ┌──────────────────────────────────┐  │
│  │  CrudPage / Custom Page          │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         Core Systems                     │
│  ┌──────┐  ┌──────┐  ┌──────┐         │
│  │ Auth │  │ API  │  │ CRUD │  ...    │
│  └──────┘  └──────┘  └──────┘         │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         Backend API                      │
└─────────────────────────────────────────┘
```

## 🧩 Module Anatomy

### Module Structure

```typescript
// modules/driver/index.ts
export const driverModule: FrontModule = {
  name: 'driver',
  routes: [
    {
      path: '/drivers',
      element: <DriverListPage />,
      permission: 'driver.read'
    }
  ],
  menu: [
    {
      id: 'drivers',
      label: 'Drivers',
      path: '/drivers',
      icon: TruckIcon,
      permission: 'driver.read'
    }
  ],
  permissions: [
    'driver.read',
    'driver.create',
    'driver.update',
    'driver.delete'
  ]
};
```

### Module Registration

```typescript
// app/registerModules.ts
import { dashboardModule } from '@/modules/dashboard';
import { userModule } from '@/modules/user';
import { driverModule } from '@/modules/driver';

export const modules: FrontModule[] = [
  dashboardModule,
  userModule,
  driverModule,
];
```

## 🔐 Permission System

### Permission Naming Convention

```
<module>.<action>

Examples:
- driver.read
- driver.create
- driver.update
- driver.delete
- user.admin
```

### Using Permissions

#### Component Level
```tsx
import { Can } from '@/core/auth';

<Can permission="driver.create">
  <Button>Add Driver</Button>
</Can>

// Multiple permissions (any)
<Can permissions={["driver.read", "driver.admin"]}>
  <DriverList />
</Can>

// Multiple permissions (all required)
<Can permissions={["driver.read", "driver.update"]} requireAll>
  <EditDriver />
</Can>
```

#### Route Level
```tsx
{
  path: '/drivers',
  element: <DriverListPage />,
  permission: 'driver.read'
}
```

#### Programmatic Check
```tsx
const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

if (hasPermission('driver.create')) {
  // Show create button
}
```

## 🎨 UI Patterns

### Shared UI Components

The application uses the `@kwim/shared-ui` package for common UI components across all modules. This ensures consistency and reduces code duplication.

**Component Re-exports:**
Components in `apps/admin/src/components/` re-export from `@kwim/shared-ui` to maintain consistent import paths:

```tsx
// apps/admin/src/components/utilitie/Loading.tsx
export { Loading as default } from "@kwim/shared-ui";

// apps/admin/src/components/ui/index.ts
// Central re-export hub with dual export strategy:
export * from "@kwim/shared-ui";  // Bulk export from shared-ui

// Individual component re-exports for better module resolution
export * from "./button";
export * from "./input";
export * from "./label";
export * from "./textarea";
export * from "./select";
export * from "./dialog";
export * from "./checkbox";
export * from "./table";
export * from "./form";
export * from "./radio-group";
export * from "./tabs";
export * from "./badge";
export * from "./breadcrumb";
export * from "./alert-dialog";
export * from "./calendar";
export * from "./pagination";
export * from "./popover";
export * from "./dropdown-menu";
export * from "./tooltip";
export * from "./toast";
export * from "./toaster";

// apps/admin/src/components/ui/Breadcrumbs.tsx
export { default } from "@kwim/shared-ui";
export type { BreadcrumbItem } from "@kwim/shared-ui";
```

**Available Shared Components:**
- **UI Components** (via `@/components/ui/`):
  - `Button` - Button component with variants
  - `Input`, `Textarea`, `Label` - Form components
  - `Dialog`, `Select`, `Checkbox`, `RadioGroup` - Interactive components
  - `Table` - Table components for data display
  - `Form` - Form components with validation
  - `Tabs` - Tabbed interface components
  - `Badge` - Badge/tag components
  - `Breadcrumb` - Breadcrumb navigation component with BreadcrumbItem type
  - `AlertDialog` - Alert dialog components
  - `Calendar` - Calendar/date picker components
  - `Pagination` - Pagination controls
  - `Popover` - Popover/tooltip positioning
  - `DropdownMenu` - Dropdown menu components
  - `Tooltip` - Tooltip components
  - `Toast`, `Toaster` - Toast notification system
  - All shadcn/ui components from shared-ui package (25+ components)
- **Utility Components** (via `@/components/utilitie/`):
  - `CardDataTable` - Data card component with title, count, and stats display
  - `ReusableDataTable` - Generic table component using TanStack Table with pagination
  - `Loading` - Spinner component using react-spinners/ClipLoader
  - `AlertPopup` - SweetAlert2 wrapper functions
  - `ErrorBanner` - Error display component with retry/dismiss actions
  - `SearchBar` - Search input component
  - `map/*` - Map components:
    - `MapHoraire` - Route visualization map with departure/arrival stations
    - `MapDetailStation` - Station detail map with markers and popups
    - `MapTrip` - Trip map component for route display
    - `MapComponent` - Generic reusable map component
    - `MapComponentDyn` - Dynamic map component with interactive features
    - `GeocoderControl` - Geocoder control for location search
    - `ControlPanel` - Map control panel for settings
- **Layout Components** (from `@kwim/shared-ui`):
  - `AppLayout`, `LayoutSidebar`, `LayoutNavbar`
  - `Sidebar`, `SidebarMenuItem`, `SidebarSearch`, `SidebarFooter`
  - `ModuleShell` - Reusable sidebar + content layout for module pages
- **Other Components**:
  - `SkeletonCard` - Loading skeleton for card layouts
  - `ErrorBanner` - Error display with retry/dismiss actions

**Usage:**
```tsx
// UI components - import from @/components/ui/
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";

// Utility components
import CardDataTable from "@/components/utilitie/CardDataTable";
import { ReusableDataTable } from "@/components/utilitie/ReusableDataTable";
import Loading from "@/components/utilitie/Loading";
import { showSuccessAlert } from "@/components/utilitie/AlertPopup";
import ErrorBanner from "@/components/ErrorBanner";
import SearchBar from "@/components/utilitie/SearchBar";
import MapHoraire from "@/components/utilitie/map/MapHoraire";
import MapDetailStation from "@/components/utilitie/map/MapDetailStation";
import MapTrip from "@/components/utilitie/map/MapTrip";
import MapComponent from "@/components/utilitie/map/MapComponent";

// Direct from shared-ui (for layout components)
import { AppLayout } from "@kwim/shared-ui";

// Component usage examples
<Button variant="default">Click me</Button>
<Loading loading={isLoading} size={150} color="#0F123F" />

// CardDataTable usage (stats card)
<CardDataTable title="Total Employees" nmbre={305} />

// ReusableDataTable usage (generic table)
<ReusableDataTable
  data={employees}
  columns={employeeColumns}
  titleDataTable="Employee List"
  ComponentButtonAdd={<Button>Add Employee</Button>}
  isLoading={isLoading}
  enablePagination={true}
  pageSize={10}
/>

// Table usage
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>

// Breadcrumbs usage
const items: BreadcrumbItem[] = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/users", name: "Users" }
];
<Breadcrumbs items={items} />

// ErrorBanner usage
<ErrorBanner
  message="Failed to load data"
  details="Network connection error"
  variant="error"
  onRetry={() => refetch()}
  onDismiss={() => setError(null)}
/>

// Map usage
<MapHoraire
  departureStation={departure}
  arrivalStation={arrival}
  routes={intermediateStops}
/>
```

**Import Path Strategy:**
- Use `@/components/ui/*` for UI components (re-exported from shared-ui)
  - Individual component imports (e.g., `@/components/ui/button`) are supported via dual export strategy
  - Bulk imports from `@/components/ui` also work via wildcard re-export
- Use `@/components/utilitie/*` for utility components:
  - `CardDataTable` - Stats card component
  - `ReusableDataTable` - Generic table with pagination
  - `Loading` - Spinner component
  - `AlertPopup` - Alert functions
  - `SearchBar` - Search input
  - `map/*` - Map components (MapHoraire, MapDetailStation)
- Use `@/components/ErrorBanner` for error display component
- Use `@/components/SkeletonCard` for loading skeletons
- Use `@kwim/shared-ui` directly for layout components in app shell
- This approach maintains backward compatibility while centralizing components

**Dual Export Strategy:**
The `@/components/ui/index.ts` file uses a dual export strategy for maximum compatibility:
1. **Bulk export**: `export * from "@kwim/shared-ui"` - Exports all components from shared-ui
2. **Individual re-exports**: `export * from "./button"` - Re-exports from individual component files

This ensures both import patterns work:
```tsx
// Pattern 1: Direct component import (recommended)
import { Button } from "@/components/ui/button";

// Pattern 2: Bulk import from index
import { Button } from "@/components/ui";
```

**Component Dependencies:**
- `ErrorBanner` imports `Button` from `@kwim/shared-ui` (not from local re-exports)
- This ensures consistent component versions across the application

### Alert System

The application uses **SweetAlert2** for user notifications and alerts. A utility wrapper is provided for common alert types:

```tsx
import { 
  showSuccessAlert, 
  showErrorAlert, 
  showInfoAlert, 
  showWarningAlert 
} from '@/components/utilitie/AlertPopup';

// Success notification
showSuccessAlert('Operation completed successfully');

// Error notification
showErrorAlert('An error occurred');

// Info notification
showInfoAlert('Please note this information');

// Warning notification
showWarningAlert('This action requires confirmation');
```

**Alert Configuration:**
- Position: `top-end` (toast-style)
- Auto-dismiss: 3-4 seconds
- No confirm button (toast mode)
- Icons: success, error, info, warning

For confirmation dialogs, use SweetAlert2 directly:

```tsx
import Swal from 'sweetalert2';

Swal.fire({
  title: 'Are you sure?',
  text: 'This action cannot be undone',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#d33',
  cancelButtonColor: '#3085d6',
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'Cancel'
}).then((result) => {
  if (result.isConfirmed) {
    // Perform action
  }
});
```

### Standard Page Layout

```tsx
import { Page, PageHeader, PageToolbar, PageContent } from '@/core/ui';

function MyPage() {
  const [search, setSearch] = useState('');

  return (
    <Page>
      <PageHeader 
        title="My Page" 
        description="Page description"
        actions={<Button>Action</Button>} 
      />
      <PageToolbar 
        search={search} 
        onSearchChange={setSearch} 
      />
      <PageContent>
        {/* Your content */}
      </PageContent>
    </Page>
  );
}
```

### CRUD Page (Recommended)

```tsx
import { CrudPage } from '@/core/crud';

function DriverListPage() {
  return (
    <CrudPage config={{
      title: 'Drivers',
      queryKey: ['drivers'],
      queryFn: driverApi.list,
      columns: driverColumns,
      createFn: driverApi.create,
      updateFn: driverApi.update,
      deleteFn: driverApi.delete,
      permissions: {
        read: 'driver.read',
        create: 'driver.create',
        update: 'driver.update',
        delete: 'driver.delete',
      }
    }} />
  );
}
```

### Custom Actions

```tsx
import { ActionBar } from '@/core/crud';

<ActionBar actions={[
  {
    id: 'validate',
    label: 'Validate',
    onClick: handleValidate,
    permission: 'reservation.validate',
    variant: 'default',
    icon: CheckIcon
  },
  {
    id: 'cancel',
    label: 'Cancel',
    onClick: handleCancel,
    permission: 'reservation.cancel',
    variant: 'destructive',
    icon: XIcon
  }
]} />
```

## 🌐 API Integration

### API Client Usage

```typescript
// modules/driver/api/driver.api.ts
import { apiClient } from '@/core/api';

export const driverApi = {
  list: (params) => apiClient.get('/drivers', { params }),
  get: (id) => apiClient.get(`/drivers/${id}`),
  create: (data) => apiClient.post('/drivers', data),
  update: (id, data) => apiClient.put(`/drivers/${id}`, data),
  delete: (id) => apiClient.delete(`/drivers/${id}`),
};
```

### Automatic Tenant Headers

The API client automatically injects tenant headers:
- `X-Entreprise-Id`
- `X-Etablissement-Id`

```typescript
// Automatically includes tenant headers
const response = await apiClient.get('/drivers');

// Skip tenant headers if needed
const response = await apiClient.get('/public/data', {
  skipTenantHeaders: true
});
```

### Using with React Query

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { driverApi } from './api/driver.api';

function DriverList() {
  const { data, isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: driverApi.list,
  });

  const { mutate } = useMutation({
    mutationFn: driverApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['drivers']);
    },
  });
}
```

## 🎯 Best Practices

### 1. Module Organization
- ✅ One feature per module
- ✅ Keep modules small and focused
- ✅ Use consistent naming
- ✅ Export everything from index.ts

### 2. Component Design
- ✅ Use CrudPage for list views
- ✅ Use core UI components for layouts
- ✅ Keep components small and reusable
- ✅ Use TypeScript for type safety

### 3. State Management
- ✅ Use React Query for server state
- ✅ Use Zustand for client state
- ✅ Keep state close to where it's used
- ✅ Avoid prop drilling

### 4. Permission Checks
- ✅ Always wrap actions with `<Can>`
- ✅ Add permissions to routes
- ✅ Use descriptive permission names
- ✅ Document required permissions

### 5. API Calls
- ✅ Centralize API calls in api/ folder
- ✅ Use apiClient for automatic tenant headers
- ✅ Handle errors consistently
- ✅ Use TypeScript for request/response types

## 🗺️ Map Components

### Mapbox Integration

The application uses **react-map-gl** (declarative React wrapper) for map components instead of imperative mapbox-gl API. This provides better React integration and cleaner component code.

**Map Components:**
- `MapHoraire` - Route visualization with departure/arrival stations and intermediate stops

**Example Usage:**
```tsx
import MapHoraire from '@/components/utilitie/map/MapHoraire';

<MapHoraire
  departureStation={{
    name: "Station A",
    locations: { coordinates: [-73.935242, 40.730610] }
  }}
  arrivalStation={{
    name: "Station B",
    locations: { coordinates: [-73.935242, 40.730610] }
  }}
  routes={[
    { station: { name: "Stop 1", locations: { coordinates: [...] } } }
  ]}
/>
```

**Features:**
- Automatic center calculation between departure and arrival
- Route line visualization (LineString GeoJSON)
- Color-coded markers:
  - Green: Departure station
  - Blue: Intermediate stops
  - Red: Arrival station
- Responsive container (400px height)

**Implementation Pattern:**
```tsx
import Map, { Marker, Source, Layer } from "react-map-gl";

// Declarative approach with react-map-gl
<Map
  initialViewState={{ longitude, latitude, zoom }}
  mapStyle="mapbox://styles/mapbox/streets-v12"
  mapboxAccessToken={TOKEN}
>
  <Marker longitude={lng} latitude={lat} color="green" />
  <Source id="route" type="geojson" data={routeGeoJSON}>
    <Layer {...layerStyle} />
  </Source>
</Map>
```

**Migration Notes:**
- Components have been migrated from imperative `mapbox-gl` API to declarative `react-map-gl` for better React integration and maintainability
- Map components have been reorganized from `@/components/others/cartoTrip/` to `@/components/utilitie/map/` for better structure and discoverability (March 2026)

## 🔧 Development Workflow

### Adding a New Module

1. **Create module structure:**
```bash
mkdir -p src/modules/driver/{pages,api,schemas,components}
```

2. **Create module files:**
- `index.ts` - Module export
- `routes.tsx` - Route definitions
- `menu.ts` - Menu items
- `pages/DriverListPage.tsx` - Main page

3. **Implement using CrudPage:**
```tsx
// pages/DriverListPage.tsx
import { CrudPage } from '@/core/crud';
import { driverApi } from '../api/driver.api';
import { driverColumns } from '../columns';

export function DriverListPage() {
  return (
    <CrudPage config={{
      title: 'Drivers',
      queryKey: ['drivers'],
      queryFn: driverApi.list,
      columns: driverColumns,
      permissions: {
        read: 'driver.read',
        create: 'driver.create',
        update: 'driver.update',
        delete: 'driver.delete',
      }
    }} />
  );
}
```

4. **Register module:**
```tsx
// app/registerModules.ts
import { driverModule } from '@/modules/driver';

export const modules: FrontModule[] = [
  // ... other modules
  driverModule,
];
```

5. **Test:**
- Check routes work
- Check menu appears
- Check permissions work
- Check CRUD operations

### Debugging

#### Check Module Registration
```tsx
import { getModules } from '@/app/registerModules';
console.log('Registered modules:', getModules());
```

#### Check Permissions
```tsx
import { useAuth } from '@/core/auth';
const { permissions } = useAuth();
console.log('User permissions:', permissions);
```

#### Check Routes
```tsx
import { getAllRoutes } from '@/app/registerModules';
console.log('All routes:', getAllRoutes());
```

## 📚 Additional Resources

- **MIGRATION_STATUS.md** - Current migration status
- **IMPLEMENTATION_SUMMARY.md** - What has been implemented
- **.cursor/rules/react-typescript-conventions.mdc** - Coding conventions
- **Example modules**: `modules/dashboard/`, `modules/user/`

## 🎓 Learning Path

1. **Understand the architecture** - Read this document
2. **Study existing modules** - Look at dashboard and user modules
3. **Review core systems** - Understand auth, crud, ui, api
4. **Create a simple module** - Start with a basic CRUD module
5. **Add custom features** - Extend beyond basic CRUD
6. **Contribute** - Add new modules and improve core systems

---

**Architecture Version**: 1.0
**Last Updated**: February 6, 2026
**Status**: Production Ready (Core Systems)
