import { create } from "zustand";
import { AuthStore, User } from "./types";

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state from localStorage
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("user"),
  permissions: (() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.permissions || [];
  })(),

  setUser: (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access_token", user.accessToken);
    localStorage.setItem("refresh_token", user.refreshToken);
    const permissions = user.permissions || [];
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
    set({ permissions });
  },
}));
