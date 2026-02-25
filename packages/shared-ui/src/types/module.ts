import { ReactNode, ComponentType } from "react";

/**
 * Route definition for a module
 */
export type AppRoute = {
  path: string;
  element: ReactNode;
  permission?: string;
  index?: boolean;
};

/**
 * Menu item definition
 */
export type MenuItem = {
  id: string;
  label: string;
  icon?: ComponentType<any>;
  path?: string;
  children?: MenuItem[];
  permission?: string;
  gap?: boolean;
};

/**
 * Quick action definition
 */
export type QuickAction = {
  icon: ComponentType<any>;
  label: string;
  description?: string;
  shortcut?: string;
  href?: string;
  onClick?: () => void;
};

/**
 * Module configuration
 */
export type ModuleConfig = {
  name: string;
  displayName: string;
  icon?: ComponentType<any>;
  baseUrl: string;
  routes: AppRoute[];
  menu: MenuItem[];
  quickActions?: QuickAction[];
  permissions?: string[];
};
