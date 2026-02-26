import React, { ReactNode } from "react";
import { useSidebarStore } from "../stores/useSidebarStore";
import { MenuItem } from "../types/module";
import { LayoutSidebar } from "./LayoutSidebar";
import { LayoutNavbar } from "./LayoutNavbar";

export interface AppLayoutConfig {
  appName: string;
  logo?: ReactNode;
  menus: MenuItem[];
  user?: {
    fullName?: string;
    email?: string;
    role?: string;
    avatar?: string;
  };
  quickActions?: Array<{
    icon: React.ElementType;
    label: string;
    description?: string;
    shortcut?: string;
    onClick: () => void;
  }>;
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    time: string;
    read: boolean;
  }>;
  languages?: Array<{
    code: string;
    name: string;
    flag?: string;
  }>;
  breadcrumbs?: Array<{
    path: string;
    name: string;
  }>;
  currentPath?: string;
  onLogout?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  onSearch?: (query: string) => void;
  onViewAllNotifications?: () => void;
  onNavigate?: (path: string) => void;
  showSearch?: boolean;
  showQuickActions?: boolean;
  showNotifications?: boolean;
  showLanguageSwitcher?: boolean;
  showThemeToggle?: boolean;
  LinkComponent?: React.ComponentType<{ to: string; className?: string; children: ReactNode }>;
}

interface AppLayoutProps {
  children: ReactNode;
  config: AppLayoutConfig;
}

export function AppLayout({ children, config }: AppLayoutProps) {
  const { isOpen } = useSidebarStore();

  return (
    <div className="flex h-screen bg-white text-gray-800 dark:bg-[#0F123F] dark:text-gray-100">
      {/* Sidebar */}
      <div className="border-r border-gray-200 dark:border-gray-700">
        <LayoutSidebar
          appName={config.appName}
          logo={config.logo}
          menus={config.menus}
          user={config.user}
          onLogout={config.onLogout}
          onProfile={config.onProfile}
          onSettings={config.onSettings}
          onSearch={config.onSearch}
          showSearch={config.showSearch}
          isOpen={isOpen}
          LinkComponent={config.LinkComponent}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#101530] transition-colors duration-300">
        {/* Header/Navbar */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <LayoutNavbar
            user={config.user}
            quickActions={config.quickActions}
            notifications={config.notifications}
            languages={config.languages}
            breadcrumbs={config.breadcrumbs}
            currentPath={config.currentPath}
            onLogout={config.onLogout}
            onSearch={config.onSearch}
            onViewAllNotifications={config.onViewAllNotifications}
            onNavigate={config.onNavigate}
            showQuickActions={config.showQuickActions}
            showNotifications={config.showNotifications}
            showLanguageSwitcher={config.showLanguageSwitcher}
            showThemeToggle={config.showThemeToggle}
            LinkComponent={config.LinkComponent}
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
