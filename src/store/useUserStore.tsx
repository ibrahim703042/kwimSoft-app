import { create } from "zustand";

export interface User {
  tokenDecode: string | null;
  token: string;
  requiresPasswordReset: boolean;
  userID: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  // Chargement initial depuis le localStorage
  user: JSON.parse(localStorage.getItem("user") || "null"),

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
}));

export default useUserStore;
