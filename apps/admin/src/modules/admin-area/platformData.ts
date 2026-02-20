/**
 * Platform description and feature metadata for the admin dashboard.
 * Used to display app/server info and enabled/disabled features (Keycloak-style).
 */

import { APP_CONFIG, FEATURES, isDevelopment, isProduction } from "@/config";
import { getModules } from "@/app/registerModules";

export type FeatureStatus = "Supported" | "Experimental" | "Preview" | "Deprecated";

export interface PlatformFeature {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  enabled: boolean;
}

/** Server/App info key-value rows for the Server info tab */
export function getServerInfo(): { name: string; value: string }[] {
  const env = isProduction ? "Production" : "Development";
  return [
    { name: "Application", value: APP_CONFIG.name },
    { name: "Version", value: APP_CONFIG.version },
    { name: "Environment", value: env },
    { name: "Default language", value: APP_CONFIG.defaultLanguage },
    { name: "Supported languages", value: APP_CONFIG.supportedLanguages.join(", ") },
    { name: "Currency", value: APP_CONFIG.currency },
    { name: "Date format", value: APP_CONFIG.dateFormat },
    { name: "Time format", value: APP_CONFIG.timeFormat },
    { name: "API timeout", value: `${APP_CONFIG.api.timeout / 1000}s` },
    { name: "Pagination (default)", value: String(APP_CONFIG.pagination.defaultPageSize) },
  ];
}

/** Feature flags key to module id and description */
const FEATURE_META: Record<string, { name: string; description: string; status: FeatureStatus }> = {
  enableTransport: {
    name: "Transport",
    description: "Drivers, vehicles, stations, schedules, trips, seats, tickets, reservations",
    status: "Supported",
  },
  enableCarwash: {
    name: "Carwash",
    description: "Wash services, bays, wash orders and fleet cleaning",
    status: "Supported",
  },
  enableMaintenance: {
    name: "Maintenance",
    description: "Fleet maintenance, work orders, inspections",
    status: "Supported",
  },
  enableProducts: {
    name: "Products",
    description: "Categories, brands, products, attributes, pricing, bundles",
    status: "Supported",
  },
  enableHR: {
    name: "HR & People",
    description: "Employees, departments, contracts, leave, attendance, payroll, recruitment, training",
    status: "Supported",
  },
  enableInventory: {
    name: "Inventory",
    description: "Warehouses, stock, movements, transfers, lots",
    status: "Supported",
  },
  enableCRM: {
    name: "CRM",
    description: "Customer relationship management and sales pipeline",
    status: "Supported",
  },
  enableFinance: {
    name: "Finance",
    description: "Accounting, journal entries, tax, revenue and expenses",
    status: "Supported",
  },
  enableProcurement: {
    name: "Procurement",
    description: "Suppliers, RFQs, purchase orders",
    status: "Supported",
  },
  enableSales: {
    name: "Sales",
    description: "Sales teams, customers, pricing rules, orders",
    status: "Supported",
  },
  enableReports: {
    name: "Reports",
    description: "Analytics and reporting",
    status: "Supported",
  },
  enableDarkMode: {
    name: "Dark mode",
    description: "Theme switching (light/dark)",
    status: "Supported",
  },
  enableNotifications: {
    name: "Notifications",
    description: "In-app and push notifications",
    status: "Experimental",
  },
  enableAnalytics: {
    name: "Analytics",
    description: "Usage and business analytics",
    status: "Experimental",
  },
  enableBusManagement: {
    name: "Bus management",
    description: "Legacy bus routes and vehicles (alias for Transport)",
    status: "Deprecated",
  },
  enableFlightManagement: {
    name: "Flight management",
    description: "Legacy flight/aircraft (alias for Transport)",
    status: "Deprecated",
  },
};

/** All platform features with enabled flag from FEATURES */
export function getPlatformFeatures(): PlatformFeature[] {
  const flags = FEATURES as Record<string, boolean>;
  return Object.entries(FEATURE_META).map(([key, meta]) => ({
    id: key,
    name: meta.name,
    description: meta.description,
    status: meta.status,
    enabled: flags[key] ?? false,
  }));
}

/** Registered front-end modules (for optional display) */
export function getRegisteredModuleNames(): string[] {
  return getModules().map((m) => m.name);
}

/** Quick action for Welcome tab: navigate to a module */
export interface QuickAction {
  id: string;
  label: string;
  description: string;
  path: string;
  icon?: string;
}

export const DASHBOARD_QUICK_ACTIONS: QuickAction[] = [
  { id: "transport", label: "Transport", description: "Drivers, vehicles, trips, reservations", path: "/transport" },
  { id: "hr", label: "HR & People", description: "Employees, payroll, leave, recruitment", path: "/hr" },
  { id: "product", label: "Products", description: "Catalog, categories, pricing", path: "/product" },
  { id: "inventory", label: "Inventory", description: "Warehouses, stock, movements", path: "/inventory" },
  { id: "finance", label: "Finance", description: "Accounting, journal entries, tax", path: "/finance" },
  { id: "sales", label: "Sales", description: "Customers, teams, pricing rules", path: "/sales" },
  { id: "procurement", label: "Procurement", description: "Suppliers, RFQs, purchase orders", path: "/procurement" },
  { id: "crm", label: "CRM", description: "Pipeline and customer relations", path: "/crm" },
  { id: "report", label: "Reports", description: "Analytics and reporting", path: "/reports" },
];

/** New functionality entries for the Welcome tab */
export interface NewFunctionalityItem {
  id: string;
  title: string;
  description: string;
  date?: string;
}

export const NEW_FUNCTIONALITY: NewFunctionalityItem[] = [
  {
    id: "dashboard-tabs",
    title: "Dashboard with tabs",
    description: "Welcome, Server info, and Provider info tabs for platform overview and feature visibility.",
    date: "2025",
  },
  {
    id: "server-info",
    title: "Server info",
    description: "View application name, version, environment, language, currency, and API settings in one place.",
    date: "2025",
  },
  {
    id: "provider-info",
    title: "Provider info (features)",
    description: "Enabled and disabled features tables with status badges (Supported, Experimental, Deprecated).",
    date: "2025",
  },
  {
    id: "quick-actions",
    title: "Quick actions",
    description: "One-click navigation to Transport, HR, Products, Inventory, Finance, Sales, and more from the Welcome tab.",
    date: "2025",
  },
  {
    id: "new-functionality-section",
    title: "What's new",
    description: "This section lists recent additions and improvements to the admin console.",
    date: "2025",
  },
];
