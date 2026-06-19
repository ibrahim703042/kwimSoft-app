import { create } from "zustand";
import { AuthStore, User } from "../types";
import { setTokens, clearTokens } from "../session";

/** Roles (lower-cased) that grant wildcard (*) permission automatically */
const SUPER_ROLES = new Set([
  "superadmin", "super_admin", "admin", "super admin", "superadministrator", "super administrator",
]);

/**
 * Normalise a role value to a string.
 * Handles the case where the backend returns roles as objects
 * (e.g. { id: "...", name: "admin" }) instead of plain strings.
 */
function normalizeRole(role: any): string {
  if (typeof role === "string") return role.toLowerCase().trim();
  if (role && typeof role === "object") {
    const val = role.name || role.label || role.code || role.id || "";
    return String(val).toLowerCase().trim();
  }
  return String(role).toLowerCase().trim();
}

/**
 * Build effective permissions list.
 * If user has a super-admin role, inject "*" wildcard so every
 * `hasPermission` check passes without needing the backend to
 * enumerate every single permission string.
 */
function buildPermissions(user: User | null): string[] {
  if (!user) return [];
  const perms = [...(user.permissions || [])];
  const isSuperAdmin = user.roles?.some((r: any) => SUPER_ROLES.has(normalizeRole(r)));
  if (isSuperAdmin && !perms.includes("*")) {
    perms.push("*");
  }
  return perms;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state from localStorage
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("user"),
  permissions: buildPermissions(JSON.parse(localStorage.getItem("user") || "null")),

  setUser: (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setTokens(user.accessToken, user.refreshToken);
    const permissions = buildPermissions(user);
    set({
      user,
      isAuthenticated: true,
      permissions
    });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    clearTokens();
    set({
      user: null,
      isAuthenticated: false,
      permissions: []
    });
  },

  setPermissions: (permissions: string[]) => {
    set({ permissions });
  },
}));
