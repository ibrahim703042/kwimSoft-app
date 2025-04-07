import { create } from "zustand";

// Create Zustand store
interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false, // Sidebar fermé par défaut
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}));
