import { create } from "zustand";
import { AuthStore, User } from "./types";

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state from localStorage
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("user"),
  permissions: JSON.parse(localStorage.getItem("permissions") || "[]"),

  setUser: (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    const permissions = user.permissions || [];
    localStorage.setItem("permissions", JSON.stringify(permissions));
    set({ 
      user, 
      isAuthenticated: true,
      permissions 
    });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ 
      user: null, 
      isAuthenticated: false,
      permissions: [] 
    });
  },

  setPermissions: (permissions: string[]) => {
    localStorage.setItem("permissions", JSON.stringify(permissions));
    set({ permissions });
  },
}));
