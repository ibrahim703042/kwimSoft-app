const apiBase =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5050/api/user-management";

export const env = {
  apiBaseUrl: apiBase,
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN ?? "",
};

export const API_ROUTE = env.apiBaseUrl;
export const API_ROUTE_UPLOAD = env.apiBaseUrl;
export const API_ROUTE_PASSWORD = env.apiBaseUrl;
