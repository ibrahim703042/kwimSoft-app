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
├── components/                   # Shared components (shadcn/ui)
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
