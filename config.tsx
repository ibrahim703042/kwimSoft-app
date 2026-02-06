/**
 * Legacy Configuration File
 * This file provides backward compatibility for existing imports
 */

// Re-export from new config system
export { 
  API_ROUTE, 
  API_ROUTE_PASSWORD, 
  API_ROUTE_UPLOAD,
  API_CONFIG,
  APP_CONFIG,
  FEATURES,
  buildApiUrl,
  isDevelopment,
  isProduction,
} from './src/config';

// For easier migration, also export as default
import API_CONFIG from './src/config';
export default API_CONFIG;
