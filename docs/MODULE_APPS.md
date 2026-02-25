# Module Applications

All business modules have been created as independent Next.js applications. Each app runs on its own port and has its own URL path.

## Available Module Apps

| Module | Port | URL | Description |
|--------|------|-----|-------------|
| Admin (Legacy) | 3000 | http://localhost:3000 | Original Vite/React admin app |
| Transport | 3001 | http://localhost:3001/transport | Vehicle, driver, trip, station management |
| HR | 3002 | http://localhost:3002/hr | Employee, payroll, attendance, leave |
| Finance | 3003 | http://localhost:3003/finance | Accounts, invoices, payments, budgets |
| CRM | 3004 | http://localhost:3004/crm | Customers, leads, opportunities |
| Product | 3005 | http://localhost:3005/product | Catalog, categories, pricing |
| Sales | 3006 | http://localhost:3006/sales | Orders, quotes, sales pipeline |
| Procurement | 3007 | http://localhost:3007/procurement | Suppliers, purchase orders, RFQs |
| Manufacturing | 3008 | http://localhost:3008/manufacturing | BOMs, work orders, quality checks |
| Inventory | 3009 | http://localhost:3009/inventory | Warehouse, stock management |
| Maintenance | 3010 | http://localhost:3010/maintenance | Asset maintenance, work orders |
| Carwash | 3011 | http://localhost:3011/carwash | Car wash operations |

## Running Module Apps

### Run Individual Module

```bash
# Run specific module
pnpm dev:transport
pnpm dev:hr
pnpm dev:finance
pnpm dev:crm
pnpm dev:product
pnpm dev:sales
pnpm dev:procurement
pnpm dev:manufacturing
pnpm dev:inventory
pnpm dev:maintenance
pnpm dev:carwash
```

### Run All Modules

```bash
# Run all apps in parallel (requires multiple terminal windows or tmux)
pnpm dev:all
```

### Run Admin (Legacy)

```bash
pnpm dev:admin
```

## Module Structure

Each module app has the following structure:

```
apps/[module-name]/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main dashboard page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── config/
│   │   └── module.config.ts  # Module configuration (menus, quick actions)
│   └── components/           # Module-specific components
├── public/                   # Static assets
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.js
```

## Quick Actions

Each module has its own quick actions in the navbar dropdown. These are defined in `src/config/module.config.ts`:

### Example: Transport Module Quick Actions

- New Trip
- Add Driver
- Add Station
- View Schedule
- Plan Route
- Generate Report

### Example: HR Module Quick Actions

- New Employee
- Record Attendance
- Process Payroll
- Approve Leave
- Post Job Opening

### Example: Finance Module Quick Actions

- Create Invoice
- Record Payment
- New Budget
- Generate Report
- Reconcile Account

## Sidebar Navigation

Each module has its own sidebar menu structure defined in the module config. The sidebar is shared across all apps using the `@kwim/shared-ui` package.

### Common Sidebar Features

- Collapsible menu
- Nested menu items
- Active route highlighting
- Search functionality
- User profile dropdown
- Theme toggle
- Language switcher

## Shared Components

All modules use shared components from `@kwim/shared-ui`:

- `AppShell` - Main layout wrapper
- `Sidebar` - Navigation sidebar
- `Navbar` - Top navigation bar
- `SidebarHeader` - Logo and toggle
- `SidebarMenu` - Menu items
- `SidebarFooter` - User profile

## Development Workflow

### 1. Start a Module

```bash
pnpm dev:transport
```

### 2. Access the Module

Open http://localhost:3001/transport in your browser

### 3. Make Changes

Edit files in `apps/transport/src/` and see hot-reload in action

### 4. Add New Pages

Create new pages in `apps/transport/src/app/`

### 5. Update Module Config

Edit `apps/transport/src/config/module.config.ts` to add:
- New menu items
- Quick actions
- Routes
- Permissions

## Production Deployment

In production, these modules would be:

1. **Reverse Proxy** - Nginx or API Gateway routes requests to appropriate module
2. **Subdomain Routing** - Each module on its own subdomain (transport.kwim.com)
3. **Path-based Routing** - All modules under main domain (kwim.com/transport)
4. **Containerized** - Each module in its own Docker container
5. **Independently Scaled** - Scale modules based on demand

## Next Steps

1. **Migrate Features** - Move existing features from admin app to module apps
2. **Add Authentication** - Integrate auth from `@kwim/auth` package
3. **Connect APIs** - Wire up API calls to backend services
4. **Add Tests** - Write unit and integration tests
5. **Optimize Builds** - Configure production builds and optimization
6. **Deploy** - Set up CI/CD pipeline for module deployments

## Benefits

- **Independent Development** - Teams can work on different modules
- **Faster Builds** - Only build what changed
- **Better Performance** - Smaller bundle sizes
- **Easier Scaling** - Scale modules independently
- **Technology Flexibility** - Use different tools per module
- **Code Reusability** - Shared components reduce duplication
