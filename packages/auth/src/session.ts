/**
 * Session storage abstraction.
 *
 * Today: tokens in localStorage (legacy SPA).
 * Target: httpOnly Secure SameSite cookies set by backend (VITE_AUTH_USE_COOKIES=true).
 *
 * When cookie mode is enabled, the client must not persist tokens in localStorage;
 * apiClient sends credentials via cookies automatically.
 */
export const AUTH_USE_HTTPONLY_COOKIES =
  (import.meta.env.VITE_AUTH_USE_COOKIES ?? "").toString() === "true";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function getAccessToken(): string | null {
  if (AUTH_USE_HTTPONLY_COOKIES) return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (AUTH_USE_HTTPONLY_COOKIES) return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (AUTH_USE_HTTPONLY_COOKIES) return;
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
