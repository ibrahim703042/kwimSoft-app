/**
 * Application Configuration
 * Centralized configuration for all API endpoints and services
 */

// Environment detection
export const isDevelopment = import.meta.env?.DEV ?? process.env.NODE_ENV === 'development';
export const isProduction = import.meta.env?.PROD ?? process.env.NODE_ENV === 'production';

// Base URLs for different environments
const BASE_URLS = {
  development: {
    userManagement: "http://127.0.0.1:5050/api/user-management",
    busManagement: "http://127.0.0.1:5051/api/bus-management",
    finance: "http://127.0.0.1:5052/api/finance",
    flightManagement: "http://127.0.0.1:5053/api/flight-management",
    upload: "http://127.0.0.1:5050/api/user-management",
  },
  production: {
    userManagement: "https://api.kwimsoft.com/api/user-management",
    busManagement: "https://api.kwimsoft.com/api/bus-management",
    finance: "https://api.kwimsoft.com/api/finance",
    flightManagement: "https://api.kwimsoft.com/api/flight-management",
    upload: "https://api.kwimsoft.com/api/user-management",
  },
};

// Get current environment URLs
const currentEnv = isProduction ? "production" : "development";
const URLS = BASE_URLS[currentEnv];

/**
 * API Routes Configuration
 */
export const API_CONFIG = {
  // User Management Service
  userManagement: {
    baseUrl: URLS.userManagement,
    endpoints: {
      auth: "/auth",
      users: "/users",
      groups: "/group",
      subgroups: "/group/subgroup",
      drivers: "/drivers",
      profile: "/profile",
    },
  },

  // Bus Management Service
  busManagement: {
    baseUrl: URLS.busManagement,
    endpoints: {
      buses: "/buses",
      routes: "/routes",
      trips: "/trips",
      schedules: "/schedules",
      stations: "/stations",
      reservations: "/reservations",
      tickets: "/tickets",
    },
  },

  // Finance Service
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

  // Flight Management Service (for airplane/flight operations)
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

  // Upload Service
  upload: {
    baseUrl: URLS.upload,
    endpoints: {
      images: "/upload-files/images",
      documents: "/upload-files/documents",
      files: "/upload-files",
    },
  },
};

/**
 * Legacy API Routes (for backward compatibility)
 * @deprecated Use API_CONFIG instead
 */
export const API_ROUTE = URLS.busManagement;
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
  version: "1.0.0",
  defaultLanguage: "fr",
  supportedLanguages: ["fr", "en"],
  dateFormat: "DD/MM/YYYY",
  timeFormat: "HH:mm",
  currency: "FCFA",
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
};

/**
 * Feature Flags
 */
export const FEATURES = {
  enableBusManagement: true,
  enableFlightManagement: true,
  enableFinance: true,
  enableDarkMode: true,
  enableNotifications: true,
  enableAnalytics: false,
};

export default API_CONFIG;
