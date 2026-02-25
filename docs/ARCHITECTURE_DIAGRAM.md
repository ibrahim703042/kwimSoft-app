# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         KWIM ERP Platform                        │
│                     Multi-Tenant Monorepo                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                 │
        ┌───────▼────────┐              ┌────────▼────────┐
        │  Module Apps   │              │ Shared Packages │
        │   (Next.js)    │              │                 │
        └───────┬────────┘              └────────┬────────┘
                │                                 │
    ┌───────────┼─────────────┐                  │
    │           │             │                  │
┌───▼───┐  ┌───▼───┐    ┌───▼───┐         ┌────▼─────┐
│Transport│ │  HR   │    │Finance│         │shared-ui │
│ :3001  │ │ :3002 │    │ :3003 │         │          │
└────────┘ └───────┘    └───────┘         │ - AppShell│
                                           │ - Sidebar │
┌────────┐  ┌───────┐    ┌───────┐        │ - Navbar  │
│  CRM   │  │Product│    │ Sales │        └──────────┘
│ :3004  │  │ :3005 │    │ :3006 │
└────────┘  └───────┘    └───────┘         ┌──────────┐
                                            │   auth   │
┌────────┐  ┌───────┐    ┌───────┐         │          │
│Procure │  │Manufac│    │Invent │         │ - Login  │
│ :3007  │  │ :3008 │    │ :3009 │         │ - Logout │
└────────┘  └───────┘    └───────┘         │ - Tokens │
                                            └──────────┘
┌────────┐  ┌───────┐
│Mainten │  │Carwash│                       ┌──────────┐
│ :3010  │  │ :3011 │                       │  config  │
└────────┘  └───────┘                       │          │
                                            │ - API    │
                                            │ - Env    │
                                            └──────────┘
```

## Module App Structure

```
┌─────────────────────────────────────────────────────────┐
│              Module App (e.g., Transport)                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │              AppShell (from shared-ui)          │    │
│  │  ┌──────────┐  ┌──────────────────────────┐   │    │
│  │  │          │  │      Navbar               │   │    │
│  │  │          │  │  ┌────────────────────┐  │   │    │
│  │  │          │  │  │ Breadcrumbs        │  │   │    │
│  │  │          │  │  │ Search             │  │   │    │
│  │  │          │  │  │ Quick Actions ▼    │  │   │    │
│  │  │          │  │  │ Theme | Lang | 👤 │  │   │    │
│  │  │          │  │  └────────────────────┘  │   │    │
│  │  │          │  └──────────────────────────┘   │    │
│  │  │          │                                  │    │
│  │  │ Sidebar  │  ┌──────────────────────────┐   │    │
│  │  │          │  │                          │   │    │
│  │  │ 🚌 Logo  │  │   Page Content           │   │    │
│  │  │          │  │                          │   │    │
│  │  │ 🔍 Search│  │   - Dashboard            │   │    │
│  │  │          │  │   - Tables               │   │    │
│  │  │ 📊 Menu  │  │   - Forms                │   │    │
│  │  │   Items  │  │   - Charts               │   │    │
│  │  │          │  │   - Reports              │   │    │
│  │  │ 👤 User  │  │                          │   │    │
│  │  │          │  │                          │   │    │
│  │  └──────────┘  └──────────────────────────┘   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Quick Actions Dropdown

```
┌─────────────────────────────────────────┐
│  Navbar                                  │
│  ┌────────────────────────────────────┐ │
│  │ [+ Create ▼]                       │ │
│  └────────────────────────────────────┘ │
│         │                                │
│         ▼                                │
│  ┌────────────────────────────────────┐ │
│  │ Quick Actions                      │ │
│  ├────────────────────────────────────┤ │
│  │ 🚚 New Trip                        │ │
│  │    Schedule a new trip             │ │
│  ├────────────────────────────────────┤ │
│  │ 👤 Add Driver                      │ │
│  │    Register a new driver           │ │
│  ├────────────────────────────────────┤ │
│  │ 📍 Add Station                     │ │
│  │    Create a new station            │ │
│  ├────────────────────────────────────┤ │
│  │ 📅 View Schedule                   │ │
│  │    Check trip schedule             │ │
│  ├────────────────────────────────────┤ │
│  │ 🗺️  Plan Route                     │ │
│  │    Create a new route              │ │
│  ├────────────────────────────────────┤ │
│  │ 📄 Generate Report                 │ │
│  │    Create transport report         │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Sidebar Menu Structure

```
┌──────────────────────────────────┐
│  🚌 KwimSoft            [≡]      │
│  ┌────────────────────────────┐  │
│  │ 🔍 Search...               │  │
│  └────────────────────────────┘  │
│                                  │
│  📊 Dashboard                    │
│  🚚 Trips                        │
│  🚗 Vehicles                     │
│  👤 Drivers                      │
│  📍 Stations                     │
│  🗺️  Routes                      │
│  📅 Reservations                 │
│  📄 Reports ▼                    │
│     • Sales Report               │
│     • Trip Report                │
│     • Driver Report              │
│                                  │
│  ─────────────────────────       │
│                                  │
│  👤 John Doe                     │
│     john@kwim.com                │
└──────────────────────────────────┘
```

## Data Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ HTTP Request
       │
       ▼
┌─────────────────────────────────────┐
│     Reverse Proxy / API Gateway     │
│                                     │
│  /transport → Transport App :3001   │
│  /hr        → HR App :3002          │
│  /finance   → Finance App :3003     │
│  /crm       → CRM App :3004         │
└─────────────┬───────────────────────┘
              │
              │ Route to Module
              │
              ▼
┌─────────────────────────────────────┐
│         Module App (Next.js)        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  AppShell (shared-ui)       │   │
│  │  ├─ Sidebar                 │   │
│  │  ├─ Navbar                  │   │
│  │  └─ Content                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Module Config              │   │
│  │  ├─ Quick Actions           │   │
│  │  ├─ Menu Items              │   │
│  │  └─ Routes                  │   │
│  └─────────────────────────────┘   │
└─────────────┬───────────────────────┘
              │
              │ API Calls
              │
              ▼
┌─────────────────────────────────────┐
│         Backend Services            │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │Transport │  │   User   │        │
│  │ Service  │  │Management│        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │   HR     │  │ Finance  │        │
│  │ Service  │  │ Service  │        │
│  └──────────┘  └──────────┘        │
└─────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production Environment                │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
┌───────▼────────┐                  ┌─────────▼────────┐
│  Load Balancer │                  │   API Gateway    │
└───────┬────────┘                  └─────────┬────────┘
        │                                     │
        │                    ┌────────────────┼────────────────┐
        │                    │                │                │
┌───────▼────────┐  ┌────────▼──────┐  ┌─────▼─────┐  ┌──────▼──────┐
│  Transport     │  │      HR       │  │  Finance  │  │     CRM     │
│  Container     │  │  Container    │  │ Container │  │  Container  │
│  (Docker)      │  │  (Docker)     │  │ (Docker)  │  │  (Docker)   │
│                │  │               │  │           │  │             │
│  Port: 3001    │  │  Port: 3002   │  │Port: 3003 │  │ Port: 3004  │
│  Replicas: 3   │  │  Replicas: 2  │  │Replicas:2 │  │ Replicas: 2 │
└────────────────┘  └───────────────┘  └───────────┘  └─────────────┘
```

## Module Configuration Flow

```
┌─────────────────────────────────────────────────────────┐
│              module.config.ts                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  export const transportModuleConfig = {                 │
│    name: "transport",                                   │
│    displayName: "Transport Management",                 │
│    icon: Truck,                                         │
│    baseUrl: "/transport",                               │
│                                                          │
│    quickActions: [                                      │
│      { icon: Truck, label: "New Trip", ... }           │
│    ],                                                   │
│                                                          │
│    menu: [                                              │
│      { id: "dashboard", label: "Dashboard", ... }      │
│    ],                                                   │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    page.tsx                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  import { AppShell } from "@kwim/shared-ui";           │
│  import { transportModuleConfig } from "@/config";      │
│                                                          │
│  <AppShell                                              │
│    menus={transportModuleConfig.menu}                  │
│    quickActions={transportModuleConfig.quickActions}   │
│  >                                                      │
│    {/* Your content */}                                 │
│  </AppShell>                                            │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              AppShell (shared-ui)                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  - Renders Sidebar with menu items                      │
│  - Renders Navbar with quick actions                    │
│  - Handles layout and responsive design                 │
│  - Manages sidebar collapse state                       │
│  - Provides consistent UX                               │
└─────────────────────────────────────────────────────────┘
```

## Benefits Visualization

```
┌─────────────────────────────────────────────────────────┐
│                    Before (Monolith)                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  │         Single Large Application                │    │
│  │                                                 │    │
│  │  All modules bundled together                   │    │
│  │  Slow builds                                    │    │
│  │  Large bundle size                              │    │
│  │  Deploy everything at once                      │    │
│  │  Merge conflicts                                │    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

                           ▼
                    Transformation
                           ▼

┌─────────────────────────────────────────────────────────┐
│                After (Modular Monorepo)                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐    │
│  │Trans │  │  HR  │  │Finan │  │ CRM  │  │Prod  │    │
│  │port  │  │      │  │ ce   │  │      │  │uct   │    │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘    │
│                                                          │
│  ✅ Independent development                             │
│  ✅ Fast builds (only changed modules)                  │
│  ✅ Small bundle sizes                                  │
│  ✅ Deploy modules separately                           │
│  ✅ No merge conflicts                                  │
│  ✅ Scale independently                                 │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         Shared Components (shared-ui)           │    │
│  │  Sidebar | Navbar | AppShell | Types           │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Summary

This architecture provides:

1. **Modularity** - Each business domain is independent
2. **Scalability** - Scale modules based on demand
3. **Maintainability** - Easier to understand and modify
4. **Performance** - Smaller bundles, faster loads
5. **Developer Experience** - Faster builds, less conflicts
6. **Consistency** - Shared components ensure uniform UX
