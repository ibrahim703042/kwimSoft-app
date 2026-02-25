# @kwim/shared-ui

Shared UI components for KWIM module applications. This package provides reusable layout components (Sidebar, Navbar, AppShell) that maintain consistent UX across all module apps.

## Components

### AppShell

Main layout wrapper that combines Sidebar and Navbar with content area.

```tsx
import { AppShell } from "@kwim/shared-ui";

<AppShell
  menus={moduleConfig.menu}
  quickActions={moduleConfig.quickActions}
  currentPath="/transport/dashboard"
  isAuthenticated={true}
  user={currentUser}
  onLogout={handleLogout}
>
  <YourContent />
</AppShell>
```

### Sidebar

Collapsible sidebar with menu navigation.

```tsx
import { Sidebar } from "@kwim/shared-ui";

<Sidebar
  menus={menuItems}
  isOpen={true}
  onToggle={toggleSidebar}
  currentPath="/transport/trips"
  logo={<YourLogo />}
  title="Transport"
  user={currentUser}
  onLogout={handleLogout}
  LinkComponent={Link} // Next.js Link or React Router NavLink
/>
```

### Navbar

Top navigation bar with breadcrumbs, search, and quick actions.

```tsx
import { Navbar } from "@kwim/shared-ui";

<Navbar
  breadcrumbs={<Breadcrumbs />}
  search={<GlobalSearch />}
  quickActions={quickActions}
  userDropdown={<UserDropdown />}
/>
```

## Types

### ModuleConfig

```typescript
type ModuleConfig = {
  name: string;
  displayName: string;
  icon?: ComponentType<any>;
  baseUrl: string;
  routes: AppRoute[];
  menu: MenuItem[];
  quickActions?: QuickAction[];
  permissions?: string[];
};
```

### MenuItem

```typescript
type MenuItem = {
  id: string;
  label: string;
  icon?: ComponentType<any>;
  path?: string;
  children?: MenuItem[];
  permission?: string;
  gap?: boolean;
};
```

### QuickAction

```typescript
type QuickAction = {
  icon: ComponentType<any>;
  label: string;
  description?: string;
  shortcut?: string;
  href?: string;
  onClick?: () => void;
};
```

## Usage with Next.js

```tsx
"use client";

import { AppShell } from "@kwim/shared-ui";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Layout({ children }) {
  const pathname = usePathname();
  
  return (
    <AppShell
      menus={menus}
      currentPath={pathname}
      LinkComponent={Link}
    >
      {children}
    </AppShell>
  );
}
```

## Usage with React Router

```tsx
import { AppShell } from "@kwim/shared-ui";
import { useLocation, NavLink } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();
  
  return (
    <AppShell
      menus={menus}
      currentPath={location.pathname}
      LinkComponent={NavLink}
    >
      {children}
    </AppShell>
  );
}
```

## Styling

Components use Tailwind CSS classes. Ensure your app includes:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/shared-ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  // ... rest of config
};
```

## Development

```bash
# Type check
pnpm type-check

# Build (if needed)
pnpm build
```
