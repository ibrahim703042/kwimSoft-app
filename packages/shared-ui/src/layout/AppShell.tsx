import { ReactNode } from "react";
// import { Sidebar } from "../components/sidebar";
import { MenuItem, QuickAction } from "../types/module";
import Navbar from "./admin-header";
import Sidebar from "./admin-sidebar";

interface AppShellProps {
  children: ReactNode;
  menus?: MenuItem[];
  quickActions?: QuickAction[];
  currentPath?: string;
  isAuthenticated?: boolean;
  showShell?: boolean;
  sidebarLogo?: ReactNode;
  breadcrumbs?: ReactNode;
  search?: ReactNode;
  languageSwitcher?: ReactNode;
  themeToggle?: ReactNode;
  notifications?: ReactNode;
  userDropdown?: ReactNode;
}

/**
 * Reusable AppShell layout for all module apps
 * Provides consistent sidebar + navbar + content structure
 */
export function AppShell({
  children,
  menus = [],
  quickActions = [],
  currentPath = "",
  isAuthenticated = true,
  showShell = true,
  sidebarLogo,
  breadcrumbs,
  search,
  languageSwitcher,
  themeToggle,
  notifications,
  userDropdown,
}: AppShellProps) {
  if (!isAuthenticated || !showShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-white text-gray-800 dark:bg-[#0F123F] dark:text-gray-100">
      {/* Sidebar */}
      <div className="border-r border-gray-200 dark:border-gray-700">
        <Sidebar
          menus={menus}
          currentPath={currentPath}
          logo={sidebarLogo}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#101530] transition-colors duration-300">
        {/* Header/Navbar */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <Navbar
            breadcrumbs={breadcrumbs}
            search={search}
            quickActions={quickActions}
            languageSwitcher={languageSwitcher}
            themeToggle={themeToggle}
            notifications={notifications}
            userDropdown={userDropdown}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
