/**
 * Application Configuration
 * Centralized configuration for all API endpoints and services
 */

// Environment detection
export const isDevelopment = import.meta.env?.DEV ?? process.env.NODE_ENV === 'development';
export const isProduction = import.meta.env?.PROD ?? process.env.NODE_ENV === 'production';

// In development, allow overriding API host (e.g. when frontend runs on another server)
const DEV_API_HOST = (import.meta.env?.VITE_API_HOST as string)?.trim()?.replace(/\/+$/, "") || "http://127.0.0.1";

// Base URLs for different environments
const BASE_URLS = {
  development: {
    userManagement: `${DEV_API_HOST}:9080/api/user-management`,
    transport: `${DEV_API_HOST}:9084/api/transport-management`,
    product: `${DEV_API_HOST}:9082/api/product-management`,
    hr: `${DEV_API_HOST}:9081/api/hr-management`,
    stock: `${DEV_API_HOST}:9083/api/stock-management`,
    gateway: `${DEV_API_HOST}:9089/api/app-gateway`,
    upload: `${DEV_API_HOST}:9080/api/user-management`,
    // Aliases for backward compat
    busManagement: `${DEV_API_HOST}:9084/api/transport-management`,
    finance: `${DEV_API_HOST}:9083/api/stock-management`,
    flightManagement: `${DEV_API_HOST}:9084/api/transport-management`,
  },
  production: {
    userManagement: "https://api.kwimsoft.com/api/user-management",
    transport: "https://api.kwimsoft.com/api/transport-management",
    product: "https://api.kwimsoft.com/api/product-management",
    hr: "https://api.kwimsoft.com/api/hr-management",
    stock: "https://api.kwimsoft.com/api/stock-management",
    gateway: "https://api.kwimsoft.com/api/app-gateway",
    upload: "https://api.kwimsoft.com/api/user-management",
    busManagement: "https://api.kwimsoft.com/api/transport-management",
    finance: "https://api.kwimsoft.com/api/stock-management",
    flightManagement: "https://api.kwimsoft.com/api/transport-management",
  },
};

// Get current environment URLs
const currentEnv = isProduction ? "production" : "development";
const URLS = BASE_URLS[currentEnv];

/**
 * API Routes Configuration
 */
export const API_CONFIG = {
  // User Management Service (port 9080)
  userManagement: {
    baseUrl: URLS.userManagement,
    endpoints: {
      auth: "/auth",
      users: "/users",
      groups: "/group",
      roles: "/role",
      permissions: "/permission",
      profile: "/profile",
      tenant: "/tenant",
      subscription: "/saas-subscription",
      userSession: "/user-session",
      refreshToken: "/refresh-token",
      actionType: "/action-type",
    },
  },

  // Transport & Carwash Service (port 9084)
  transport: {
    baseUrl: URLS.transport,
    endpoints: {
      driver: "/driver",
      vehicle: "/vehicle",
      station: "/station",
      schedule: "/schedule",
      trip: "/trip",
      seat: "/seat",
      ticket: "/ticket",
      reservation: "/reservation",
      washService: "/wash-service",
      bay: "/bay",
      washOrder: "/wash-order",
      maintenanceRequest: "/maintenance-request",
      inspection: "/inspection",
      report: "/report",
    },
  },

  // Product Service (port 9082)
  product: {
    baseUrl: URLS.product,
    endpoints: {
      category: "/category",
      subCategory: "/sub-category",
      brand: "/brand",
      product: "/product",
      attribute: "/attribute",
      productTag: "/product-tag",
      productBundle: "/product-bundle",
      productPrice: "/product-price",
      productReview: "/product-review",
      gallery: "/gallery",
      media: "/media",
    },
  },

  // HR Service (port 9081)
  hr: {
    baseUrl: URLS.hr,
    endpoints: {
      employee: "/employee",
      department: "/department",
      position: "/position",
      contract: "/contract",
      leave: "/leave",
      attendance: "/attendance",
      payroll: "/payroll",
      performance: "/performance",
      recruitment: "/recruitment",
      training: "/training",
      expense: "/expense",
      onboarding: "/onboarding",
      degree: "/degree",
      idCardTemplate: "/id-card-template",
    },
  },

  // Stock/Inventory Service (port 9083)
  stock: {
    baseUrl: URLS.stock,
    endpoints: {
      warehouse: "/warehouse",
      location: "/location",
      stock: "/stock",
      stockMovement: "/stock-movement",
      stockAdjustment: "/stock-adjustment",
      transfer: "/transfer",
      inventoryCount: "/inventory-count",
      lot: "/lot",
      serialNumber: "/serial-number",
      reorderRule: "/reorder-rule",
      stockReservation: "/stock-reservation",
    },
  },

  // Gateway (port 9089)
  gateway: {
    baseUrl: URLS.gateway,
  },

  // Upload Service
  upload: {
    baseUrl: URLS.upload,
    endpoints: {
      images: "/upload-files/images",
      documents: "/upload-files/documents",
      files: "/upload-files",
    },
  },

  // Backward compat aliases
  busManagement: {
    baseUrl: URLS.busManagement,
    endpoints: {
      buses: "/vehicle",
      routes: "/schedule",
      trips: "/trip",
      schedules: "/schedule",
      stations: "/station",
      reservations: "/reservation",
      tickets: "/ticket",
    },
  },
  finance: {
    baseUrl: URLS.finance,
    endpoints: {
      transactions: "/transactions",
      payments: "/payments",
      revenue: "/revenue",
      expenses: "/expenses",
      reports: "/reports",
    },
  },
  flightManagement: {
    baseUrl: URLS.flightManagement,
    endpoints: {
      flights: "/flights",
      aircraft: "/aircraft",
      airports: "/airports",
      bookings: "/bookings",
      crew: "/crew",
      maintenance: "/maintenance",
    },
  },
};

/**
 * Legacy API Routes (for backward compatibility)
 * @deprecated Use API_CONFIG instead
 */
export const API_ROUTE = URLS.transport;
export const API_ROUTE_PASSWORD = URLS.userManagement;
export const API_ROUTE_UPLOAD = URLS.upload;

/**
 * Helper function to build full API URL
 */
export const buildApiUrl = (
  service: keyof typeof API_CONFIG,
  endpoint: string
): string => {
  const config = API_CONFIG[service];
  return `${config.baseUrl}${endpoint}`;
};

/**
 * Application Settings
 */
export const APP_CONFIG = {
  name: "KwimSoft",
  version: "2.0.0",
  defaultLanguage: "fr",
  supportedLanguages: ["fr", "en"],
  dateFormat: "DD/MM/YYYY",
  timeFormat: "HH:mm",
  currency: "CDF",
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },
  api: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
};

/**
 * Feature Flags
 */
export const FEATURES = {
  enableTransport: true,
  enableCarwash: true,
  enableMaintenance: true,
  enableProducts: true,
  enableHR: true,
  enableInventory: true,
  enableCRM: true,
  enableFinance: true,
  enableProcurement: true,
  enableSales: true,
  enableReports: true,
  enableDarkMode: true,
  enableNotifications: true,
  enableAnalytics: true,
  // Legacy
  enableBusManagement: true,
  enableFlightManagement: true,
};

export default API_CONFIG;
