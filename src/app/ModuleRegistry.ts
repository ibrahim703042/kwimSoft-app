import { ReactNode, ComponentType } from "react";

/**
 * Route definition for a module
 */
export interface AppRoute {
  path: string;
  element: ReactNode;
  permission?: string;
  index?: boolean;
}

/**
 * Menu item definition
 */
export interface MenuItem {
  id: string;
  label: string;
  icon?: ComponentType<any>;
  path?: string;
  children?: MenuItem[];
  permission?: string;
  gap?: boolean;
}

/**
 * Front-end module definition (Odoo-like)
 * Each module declares its routes, menus, and permissions
 */
export interface FrontModule {
  name: string;
  routes: AppRoute[];
  menu: MenuItem[];
  permissions?: string[];
}

/**
 * Module registry - holds all registered modules
 */
export class ModuleRegistry {
  private static modules: FrontModule[] = [];

  static register(module: FrontModule): void {
    this.modules.push(module);
  }

  static registerMany(modules: FrontModule[]): void {
    modules.forEach((module) => this.register(module));
  }

  static getModules(): FrontModule[] {
    return this.modules;
  }

  static getModule(name: string): FrontModule | undefined {
    return this.modules.find((m) => m.name === name);
  }

  static getAllRoutes(): AppRoute[] {
    return this.modules.flatMap((m) => m.routes);
  }

  static getAllMenus(): MenuItem[] {
    return this.modules.flatMap((m) => m.menu);
  }

  static getAllPermissions(): string[] {
    return this.modules.flatMap((m) => m.permissions || []);
  }

  static clear(): void {
    this.modules = [];
  }
}
